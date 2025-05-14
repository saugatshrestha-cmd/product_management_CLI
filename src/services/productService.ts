import { injectable, inject } from "tsyringe";
import { ProductRepository } from '@mytypes/repoTypes';
import { CategoryService } from '@services/categoryService';
import { FileService } from "./fileService";
import { AppError } from "@utils/errorHandler";
import { ProductStatus } from "@mytypes/enumTypes";
import { Product, ProductInput } from '@mytypes/productTypes';
import { ProductRepositoryFactory } from "@factories/productFactory";
import { CloudService } from "./cloudService";
import { logger } from "@utils/logger";
import { AuditService } from "./auditService";
import { Request } from "express";

@injectable()
export class ProductService {
  private productRepository: ProductRepository;
  constructor(
    @inject("ProductRepositoryFactory") private productRepositoryFactory: ProductRepositoryFactory,
    @inject("CategoryService") private categoryService: CategoryService,
    @inject("CloudService") private cloudService: CloudService,
    @inject("FileService") private fileService: FileService,
    @inject("AuditService") private auditService: AuditService
  ) {
    this.productRepository = this.productRepositoryFactory.getRepository();
  }


  async createProduct(productData: ProductInput, files: Express.Multer.File[] = [], req?: Request): Promise<{ message: string }> {
    try{
      const { name, description = "", price, categoryId, quantity, sellerId } = productData;
    const existingProduct = await this.productRepository.getAll();
    if (existingProduct.some(product => product.name.toLowerCase() === name.toLowerCase())) {
      logger.warn("Product already exists");
      throw AppError.conflict("Product already exist");
    }
    if (categoryId && !(await this.categoryService.getCategoryById(categoryId))) {
      logger.warn("Category not found");
      throw AppError.notFound("Category does not exist", categoryId);
    }

    const fileIds: string[] = [];
    if (files.length > 0) {
    try {
      const uploadResults = await this.cloudService.upload(
        files.map(f => ({ buffer: f.buffer, originalName: f.originalname })),
        'products'
      );

      for (const uploaded of uploadResults) {
        const saved = await this.fileService.saveFileMetadata(uploaded);
        if (!saved._id) {
          throw new Error("File save operation didn't return an ID");
        }
        fileIds.push(saved._id);
      }
    } catch (error) {
      logger.error("File processing failed", error);
      throw AppError.internal("Image upload failed");
    }
  }
    const newProduct = await this.productRepository.add({ ...productData, images: fileIds, status: ProductStatus.ACTIVE });
    await this.auditService.logAudit({
        action: 'create_product',
        entity: 'Product',
        entityId: newProduct._id,
        userId: newProduct.sellerId,
        status: 'success',
        message: 'Product added successfully',
        req
      });
    return { message: "Product added successfully" };
  }catch(error:any){
    logger.error("Unexpected error while creating product", error);
      await this.auditService.logAudit({
        action: 'create_product',
        entity: 'Product',
        entityId: productData.sellerId,
        userId: productData.sellerId,
        status: 'failed',
        message: error.message,
        req
      });
      throw AppError.badRequest("Something went wrong while creating the product");
    }
  }

  async getProductById(productId: string): Promise<Product | { message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.getAll();
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return await this.productRepository.getBySellerId(sellerId);
  }

  async updateProduct(
    productId: string,
    updatedInfo: Partial<Product>,
    newFiles: Express.Multer.File[] = [],
    filesToDelete: string[] = [], req?: Request
  ): Promise<{ message: string }> {
    try{
      const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }
    // Validate category if being updated
    if (updatedInfo.categoryId && !(await this.categoryService.getCategoryById(updatedInfo.categoryId))) {
      logger.warn("Category not found");
      throw AppError.notFound("Category does not exist", updatedInfo.categoryId);
    }
    const beforeState = {
        ...product,
        images: [...product.images] // Clone images array
      };
    let updatedImages = product.images.map(id => id.toString());
    // Handle file deletions
    if (filesToDelete.length > 0) {
      // Convert all IDs to strings for consistent comparison
      const filesToDeleteStrings = filesToDelete.map(id => id.toString());
      
      // Delete from Cloudinary and database
      await Promise.all(
        filesToDeleteStrings.map(async (fileId) => {
          const fileMeta = await this.fileService.getFileMetadata(fileId);
          if (fileMeta?.publicId) {
            await this.cloudService.deleteFile(fileMeta.publicId);
            await this.fileService.deleteFileMetadata(fileId);
          }
        })
      );
      // Filter out deleted files (compare as strings)
      updatedImages = updatedImages.filter(id => !filesToDeleteStrings.includes(id));
    }
    // Handle new file uploads
    if (newFiles.length > 0) {
      const uploadResults = await this.cloudService.upload(
        newFiles.map(f => ({ buffer: f.buffer, originalName: f.originalname })),
        'products'
      );
      for (const result of uploadResults) {
        const saved = await this.fileService.saveFileMetadata(result);
        updatedImages.push(saved._id!); // Ensure we store as string
      }
    }
    // Update other product information
    const updatedProduct = await this.productRepository.update(productId, {
    ...updatedInfo,
    images: updatedImages // This updates the 'images' field in database
  });
  await this.auditService.logAudit({
        action: 'update_product',
        entity: 'Product',
        entityId: productId,
        userId: product.sellerId,
        status: 'success',
        beforeState,
        afterState: updatedProduct,
        message: 'Product updated successfully',
        req
      });
    return { message: "Product updated successfully" };
  }catch(error:any){
    await this.auditService.logAudit({
        action: 'update_product',
        entity: 'Product',
        entityId: productId,
        status: 'failed',
        message: error.message,
        req
      });
      logger.error("Unexpected error while updating product", error);
  throw AppError.internal("Something went wrong while updating the product");
  }
  }

  async updateQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.update(productId, { quantity: product.quantity });
    return { message: "Product quantity updated successfully" };
  }

  async decreaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }
    product.quantity = Math.max(0, product.quantity - newQuantity);
    await this.productRepository.update(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async increaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }
    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.update(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async deleteProduct(productId: string, req?: Request): Promise<{ message: string }> {
    try{const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound('Product', productId);
    }
    if (product.status === ProductStatus.DELETED) return { message: "Product already deleted" };
  if (product.images && product.images.length > 0) {
      try {
        // Get all file metadata
        const fileMetadataPromises = product.images.map(fileId => 
          this.fileService.getFileMetadata(fileId)
        );
        const fileMetadataResults = await Promise.all(fileMetadataPromises);
        // Delete files from cloud storage
        const deletePromises = fileMetadataResults
          .filter(meta => meta?.publicId)
          .map(meta => this.cloudService.deleteFile(meta!.publicId!));
        // Delete file metadata from database
        const deleteMetadataPromises = product.images.map(fileId => 
          this.fileService.deleteFileMetadata(fileId)
        );
        await Promise.all([...deletePromises, ...deleteMetadataPromises]);
        logger.info(`All files deleted for product ${productId}`);
      } catch (error) {
        logger.error(`Failed to delete files for product ${productId}: ${error instanceof Error ? error.message : String(error)}`);
        // Continue with product deletion even if file deletion fails
      }
    }
    await this.productRepository.update(productId, {
      status: ProductStatus.DELETED,
      deletedAt: new Date(),
      images: []
    });
    await this.auditService.logAudit({
        action: 'delete_product',
        entity: 'Product',
        entityId: productId,
        userId: product.sellerId,
        status: 'success',
        message: 'Product deleted successfully',
        req
      });
    return { message: "Product deleted successfully" };
  }catch(error:any){
    logger.error("Unexpected error while deleting product", error);
    await this.auditService.logAudit({
        action: 'delete_product',
        entity: 'Product',
        entityId: productId,
        status: 'failed',
        message: error.message,
        req
      });
  throw AppError.internal("Something went wrong while deleting the product");
  }
  }

  async deleteProductsBySellerId(sellerId: string, req?: Request): Promise<{ message: string }> {
    try{const products = await this.productRepository.getBySellerId(sellerId);
    if (!products || products.length === 0) {
      logger.warn("Product not found for this seller");
      throw AppError.notFound("Products not found for this seller");
    }
    
    await this.productRepository.updateMany(
      { sellerId }, 
      { $set: { status: ProductStatus.DELETED, deletedAt: new Date() } }
    );
    await this.auditService.logAudit({
        action: 'delete_product',
        entity: 'Product',
        entityId: sellerId,
        userId: sellerId,
        status: 'success',
        message: 'Product deleted successfully',
        req
      });
    return { message: "Product deleted successfully" };
  }catch(error:any){
    await this.auditService.logAudit({
        action: 'delete_product',
        entity: 'Product',
        entityId: sellerId,
        status: 'failed',
        message: error.message,
        req
      });
      logger.error("Unexpected error while deleting product", error);
  throw AppError.internal("Something went wrong while deleting the product");;
  }
  }
}
