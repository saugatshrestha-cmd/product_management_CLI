import { injectable, inject } from "tsyringe";
import { ProductRepository } from '@repository/productRepo';
import { CategoryService } from '@services/categoryService';
import { AppError } from "@utils/errorHandler";
import { Product, ProductInput } from '@mytypes/productTypes';

@injectable()
export class ProductService {

  constructor(
    @inject("ProductRepository") private productRepository: ProductRepository,
    @inject("CategoryService") private categoryService: CategoryService
  ) {}


  async createProduct(productData: ProductInput): Promise<{ message: string }> {
    const { name, description = "", price, categoryId, quantity, sellerId } = productData;
    

    const existingProduct = await this.productRepository.getAll();
    if (existingProduct.some(product => product.name.toLowerCase() === name.toLowerCase())) {
      throw AppError.conflict("Product already exist");
    }

    if (categoryId && !(await this.categoryService.getCategoryById(categoryId))) {
      throw AppError.notFound("Category does not exist", categoryId);
    }
    

    await this.productRepository.addProduct({ name, description, price, categoryId, quantity, sellerId });
    return { message: "Product added successfully" };
  }

  async getProductById(productId: string): Promise<Product | { message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
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
      throw AppError.notFound("Product not found", productId);
    }

    if (updatedInfo.categoryId && !(await this.categoryService.getCategoryById(updatedInfo.categoryId))) {
      throw AppError.notFound("Category does not exist", updatedInfo.categoryId);
    }

    await this.productRepository.updateProduct(productId, updatedInfo);
    return { message: "Product updated successfully" };
  }

  async updateQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw AppError.notFound("Product not found", productId);
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity updated successfully" };
  }

  async decreaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw AppError.notFound("Product not found", productId);
    }

    product.quantity = Math.max(0, product.quantity - newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async increaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw AppError.notFound("Product not found", productId);
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw AppError.notFound('Product', productId);
    }
    const success = await this.productRepository.deleteProductById(productId);
    if (!success) {
      throw AppError.internal('Failed to delete product');
    }
    return { message: "Product deleted successfully" };;
  }
}
