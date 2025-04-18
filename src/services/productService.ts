import { ProductRepository } from '../repository/mongo_repo/productRepo';
import { CategoryService } from './categoryService';
import { Product } from '../types/productTypes';

export class ProductService {
  private productRepository: ProductRepository;
  private categoryService: CategoryService;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryService = new CategoryService();
  }

  private async findProductById(productId: number): Promise<Product | undefined> {
    const products = await this.productRepository.getAll();
    return products.find(product => product.id === productId);
  }

  async createProduct(productData: Omit<Product, 'id'>): Promise<{ message: string }> {
    const { name, description = "", price, categoryId, quantity } = productData;

    const existingProduct = await this.productRepository.getAll();
    if (existingProduct.some(product => product.name.toLowerCase() === name.toLowerCase())) {
      return { message: "Product already exists." };
    }

    if (categoryId && !(await this.categoryService.getCategoryById(categoryId))) {
      return { message: "Invalid category ID. Category does not exist." };
    }

    await this.productRepository.addProduct({ name, description, price, categoryId, quantity });
    return { message: "Product added successfully" };
  }

  async getProductById(productId: number): Promise<Product | { message: string }> {
    const product = await this.findProductById(productId);
    return product || { message: "Product not found" };
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.productRepository.getAll();
  }

  async updateProduct(productId: number, updatedInfo: Partial<Product>): Promise<{ message: string }> {
    const product = await this.findProductById(productId);
    if (!product) {
      return { message: "Product not found" };
    }

    if (updatedInfo.categoryId && !(await this.categoryService.getCategoryById(updatedInfo.categoryId))) {
      return { message: "Invalid category ID. Category does not exist." };
    }

    await this.productRepository.updateProduct(productId, updatedInfo);
    return { message: "Product updated successfully" };
  }

  async updateQuantity(productId: number, newQuantity: number): Promise<{ message: string }> {
    const product = await this.findProductById(productId);
    if (!product) {
      return { message: "Product not found" };
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity updated successfully" };
  }

  async decreaseQuantity(productId: number, newQuantity: number): Promise<{ message: string }> {
    const product = await this.findProductById(productId);
    if (!product) {
      return { message: "Product not found" };
    }

    product.quantity = Math.max(0, product.quantity - newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async increaseQuantity(productId: number, newQuantity: number): Promise<{ message: string }> {
    const product = await this.findProductById(productId);
    if (!product) {
      return { message: "Product not found" };
    }

    product.quantity = Math.max(0, product.quantity + newQuantity);
    await this.productRepository.updateProduct(productId, { quantity: product.quantity });
    return { message: "Product quantity decreased successfully" };
  }

  async deleteProduct(productId: number): Promise<{ message: string }> {
    const success = await this.productRepository.deleteProductById(productId);
    return { message: success ? "Product deleted successfully" : "Product not found" };
  }
}
