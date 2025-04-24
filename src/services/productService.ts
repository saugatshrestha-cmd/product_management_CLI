import { injectable, inject } from "tsyringe";
import { ProductRepository } from '../repository/mongo_repo/productRepo';
import { CategoryService } from './categoryService';
import { Product, ProductInput } from '../types/productTypes';

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
      return { message: "Product already exists." };
    }

    if (categoryId && !(await this.categoryService.getCategoryById(categoryId))) {
      return { message: "Invalid category ID. Category does not exist." };
    }
    

    await this.productRepository.addProduct({ name, description, price, categoryId, quantity, sellerId });
    return { message: "Product added successfully" };
  }

  async getProductById(productId: string): Promise<Product | { message: string }> {
    const product = await this.productRepository.findById(productId);
    return product || { message: "Product not found" };
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
      return { message: "Product not found" };
    }

    if (updatedInfo.categoryId && !(await this.categoryService.getCategoryById(updatedInfo.categoryId))) {
      return { message: "Invalid category ID. Category does not exist." };
    }

    await this.productRepository.updateProduct(productId, updatedInfo);
    return { message: "Product updated successfully" };
  }

  async updateQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return { message: "Product not found" };
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity updated successfully" };
  }

  async decreaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return { message: "Product not found" };
    }

    product.quantity = Math.max(0, product.quantity - newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async increaseQuantity(productId: string, newQuantity: number): Promise<{ message: string }> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      return { message: "Product not found" };
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async deleteProduct(productId: string): Promise<{ message: string }> {
    const success = await this.productRepository.deleteProductById(productId);
    return { message: success ? "Product deleted successfully" : "Product not found" };
  }
}
