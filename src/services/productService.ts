import { injectable, inject } from "tsyringe";
import { ProductRepository } from '@mytypes/repoTypes';
import { CategoryService } from '@services/categoryService';
import { AppError } from "@utils/errorHandler";
import { ProductStatus } from "@mytypes/enumTypes";
import { Product, ProductInput } from '@mytypes/productTypes';
import { ProductRepositoryFactory } from "@factories/productFactory";
import { logger } from "@utils/logger";

@injectable()
export class ProductService {
  private productRepository: ProductRepository;
  constructor(
    @inject("ProductRepositoryFactory") private productRepositoryFactory: ProductRepositoryFactory,
    @inject("CategoryService") private categoryService: CategoryService
  ) {
    this.productRepository = this.productRepositoryFactory.createRepository();
  }


  async createProduct(productData: ProductInput): Promise<{ message: string }> {
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
    
    await this.productRepository.add({ name, description, price, categoryId, quantity, sellerId, status: ProductStatus.ACTIVE });
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

  async updateProduct(productId: string, updatedInfo: Partial<Product>): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      logger.warn("Product not found");
      throw AppError.notFound("Product not found", productId);
    }

    if (updatedInfo.categoryId && !(await this.categoryService.getCategoryById(updatedInfo.categoryId))) {
      logger.warn("Category not found");
      throw AppError.notFound("Category does not exist", updatedInfo.categoryId);
    }

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
