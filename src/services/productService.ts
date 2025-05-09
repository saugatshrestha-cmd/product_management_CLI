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

@injectable()
export class ProductService {
  private productRepository: ProductRepository;
  constructor(
    @inject("ProductRepositoryFactory") private productRepositoryFactory: ProductRepositoryFactory,
    @inject("CategoryService") private categoryService: CategoryService,
    @inject("CloudService") private cloudService: CloudService,
    @inject("FileService") private fileService: FileService
  ) {
    this.productRepository = this.productRepositoryFactory.getRepository();
  }


  async createProduct(productData: ProductInput, fileBuffer: Buffer, originalName: string): Promise<{ message: string }> {
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
    const folderName = 'products'; 
    const fileMetadata = await this.cloudService.uploadFile(fileBuffer, folderName, originalName);
    
    const savedFile = await this.fileService.saveFileMetadata(fileMetadata);
    await this.productRepository.add({ name, description, price, categoryId, quantity, images: savedFile._id, sellerId, status: ProductStatus.ACTIVE });
    return { message: "Product added successfully" };
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
    fileBuffer: Buffer | null,
    originalName: string | null
  ): Promise<{ message: string }> {
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

    // Handle file update if new file is provided
    if (fileBuffer && originalName) {
      if (!product.images) {
        logger.warn("Product has no existing image to update");
        throw AppError.badRequest("Product has no existing image to update");
      }

      try {
        // Get existing file metadata
        const existingFile = await this.fileService.getFileMetadata(product.images);
        if (!existingFile?.publicId) {
          logger.warn("Existing file metadata not found");
          throw AppError.notFound("Existing file data not found");
        }

        // Update the file in Cloudinary
        const folderName = 'products';
        const newFileMetadata = await this.cloudService.updateFile(
          fileBuffer,
          folderName,
          originalName,
          existingFile.publicId
        );

        // Update the file metadata in database
        await this.fileService.updateFileMetadata(product.images, newFileMetadata);
        logger.info(`Updated image for product ${productId}`);
      } catch (error) {
        logger.error(`Failed to update product image: ${error instanceof Error ? error.message : String(error)}`);
        throw AppError.internal("Failed to update product image");
      }
    }

    // Update other product information
    await this.productRepository.update(productId, updatedInfo);
    return { message: "Product updated successfully" };
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

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound('Product', productId);
    }
    if (product.status === ProductStatus.DELETED) return { message: "Product already deleted" };
    if (product.images) {
    try {
      const fileMetadata = await this.fileService.getFileMetadata(product.images);
      if (fileMetadata && fileMetadata.publicId) {
        await this.cloudService.deleteFile(fileMetadata.publicId);
        logger.info(`File associated with product ${productId} deleted from Cloudinary`);
      }
    } catch (error:any) {
      logger.error(`Failed to delete file for product ${productId}: ${error.message}`);
      throw new AppError('Failed to delete file from Cloudinary');
    }
  }
    await this.productRepository.update(productId, {
      status: ProductStatus.DELETED,
      deletedAt: new Date()
    });
    return { message: "Product deleted successfully" };;
  }

  async deleteProductsBySellerId(sellerId: string): Promise<{ message: string }> {
    const products = await this.productRepository.getBySellerId(sellerId);
    if (!products || products.length === 0) {
      logger.warn("Product not found for this seller");
      throw AppError.notFound("Products not found for this seller");
    }
    
    await this.productRepository.updateMany(
      { sellerId }, 
      { $set: { status: ProductStatus.DELETED, deletedAt: new Date() } }
    );
    return { message: "Product deleted successfully" };
  }
}
