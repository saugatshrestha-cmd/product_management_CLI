import { ProductRepository } from '../repository/productCatalogRepo';
import { CategoryService } from './categoryService';
import { Product } from '../types/productTypes';

export class ProductService {
  private productRepository: ProductRepository;
  private categoryService: CategoryService;

  constructor() {
    this.productRepository = new ProductRepository();
    this.categoryService = new CategoryService();
  }

  // Helper function to find a product by its ID
  private findProductById(productId: number): Product | undefined {
    return this.productRepository.getAll().find(product => product.id === productId);
  }

  // Create product
  createProduct(productData: Omit<Product, 'id'>): { message: string } {
    const { name, description = "", price, categoryId, quantity } = productData;

    // Check if product already exists
    const existingProduct = this.productRepository.getAll().find(product => product.name.toLowerCase() === name.toLowerCase());
    if (existingProduct) {
      return { message: "Product already exists." };
    }

    // Check if category exists
    if (categoryId && !this.categoryService.findCategoryById(categoryId)) {
      return { message: "Invalid category ID. Category does not exist." };
    }

    const newProduct = this.productRepository.addProduct({ name, description, price, categoryId, quantity });
    return { message: "Product added successfully" };
  }

  // Get product by id
  getProductById(productId: number) {
    const product = this.findProductById(productId);
    return product || { message: "Product not found" };
  }

  // Get all products
  getAllProducts(): Product[] {
    return this.productRepository.getAll();
  }

  // Update product
  updateProduct(productId: number, updatedInfo: Product): { message: string } {
    const product = this.findProductById(productId);
    if (!product) return { message: "Product not found" };

    // Check if category exists
    if (updatedInfo.categoryId && !this.categoryService.findCategoryById(updatedInfo.categoryId)) {
      return { message: "Invalid category ID. Category does not exist." };
    }

    Object.assign(product, updatedInfo);
    this.productRepository.saveProducts();
    return { message: "Product updated successfully" };
  }

  // Update product quantity
  updateQuantity(productId: number, newQuantity: number): { message: string } {
    const product = this.findProductById(productId);
    if (!product) return { message: "Product not found" };

    product.quantity = Math.max(0, product.quantity + newQuantity); // Prevent negative stock
    this.productRepository.saveProducts();
    return { message: "Product quantity updated successfully" };
  }

  // Decrease product quantity
  decreaseQuantity(productId: number, newQuantity: number): { message: string } {
    const product = this.findProductById(productId);
    if (!product) return { message: "Product not found" };

    product.quantity = Math.max(0, product.quantity - newQuantity); // Prevent negative stock
    this.productRepository.saveProducts();
    return { message: "Product quantity decreased successfully" };
  }

  // Bulk update all product prices
  bulkUpdateAllPrices(newPrice: number): { message: string } {
    if (newPrice < 0) {
      return { message: "Price cannot be negative" };
    }

    this.productRepository.getAll().forEach(product => {
      product.price = newPrice;
    });
    this.productRepository.saveProducts();
    return { message: `Updated price for all ${this.productRepository.getAll().length} product(s)` };
  }

  // Bulk update all product quantities
  bulkUpdateAllQuantities(quantityChange: number): { message: string } {
    this.productRepository.getAll().forEach(product => {
      product.quantity = Math.max(0, product.quantity + quantityChange); // Prevent negative stock
    });
    this.productRepository.saveProducts();
    return { message: `Updated quantity for all ${this.productRepository.getAll().length} product(s)` };
  }

  // Delete product
  deleteProduct(productId: number): { message: string } {
    const success = this.productRepository.deleteProductById(productId);
    return { message: success ? "Product deleted successfully" : "Product not found" };
  }
}
