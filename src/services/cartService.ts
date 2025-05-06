import { injectable, inject } from "tsyringe";
import { Product } from '@mytypes/productTypes';
import { CartRepository } from '@mytypes/repoTypes';
import { AppError } from "@utils/errorHandler";
import { ProductService } from '@services/productService';
import { Cart } from '@mytypes/cartTypes';
import { CartRepositoryFactory } from "@factories/cartFactory";
import { logger } from "@utils/logger";

@injectable()
export class CartService {
  private cartRepository: CartRepository;
  constructor(
    @inject(CartRepositoryFactory) private CartRepositoryFactory: CartRepositoryFactory,
    @inject("ProductService") private productService: ProductService
  ) {
    this.cartRepository = this.CartRepositoryFactory.createRepository();
  }

  private isProduct(product: any): product is Product {
    return product && typeof product._id === 'object' && product.sellerId;
  }

  async createCart(productId: string, quantity: number, userId: string): Promise<{ message: string }> {
    const product = await this.productService.getProductById(productId);
    if (!this.isProduct(product)) {
      logger.warn("Product not found");
      return { message: "Product not found" };
    }
    if (quantity > product.quantity) {
      throw AppError.badRequest("Requested quantity exceeds available stock");
    }
    const userCart = await this.cartRepository.findCartByUserId(userId);
    if (!userCart) {
      await this.cartRepository.add({
        userId,
        items: [{ productId: product._id, quantity, sellerId: product.sellerId }],
      });
    } else {
      const productInCart = userCart.items.find(
        item => item.productId.toString() === product._id.toString()
      );
      if (productInCart) {
        throw AppError.conflict("Product already in cart");
      }
      userCart.items.push({ productId: product._id, quantity, sellerId: product.sellerId });
      await this.cartRepository.updateCart(userId, userCart.items);
    }
    return { message: 'Product added to cart successfully' };
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number): Promise<{ message: string }> {
    if (quantity <= 0) {
      return { message: "Amount must be greater than zero" }; // You can adjust the condition to allow only positive numbers.
    }
    const cart = await this.cartRepository.findCartByUserId(userId);
    if (!cart) {
      logger.warn("Cart not found");
      throw AppError.notFound("Cart not found", userId);
    }
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
    if (itemIndex === -1) {
      return { message: "Product not in cart" };
    }
    cart.items[itemIndex].quantity = quantity;
    await this.cartRepository.updateCart(userId, cart.items);
    return { message: "Product quantity updated successfully" };
  }      

  async removeFromCart(productId: string, userId: string): Promise<{ message: string }> {
    const userCart = await this.cartRepository.findCartByUserId(userId);
    if (!userCart) {
      logger.warn("Cart not found");
      throw AppError.notFound("Cart not found", userId);
    }
    const itemIndex = userCart.items.findIndex(item => item.productId === productId);
    if (itemIndex !== -1) {
      userCart.items.splice(itemIndex, 1);
      await this.cartRepository.updateCart(userId, userCart.items);
    }
    return { message: 'Product removed from cart successfully' };
  }

  async removeCartByUserId(userId: string): Promise<{ message: string }> {
    const removed = await this.cartRepository.removeCartByUserId(userId);
    return removed
      ? { message: 'Cart removed successfully' }
      : { message: `Cart not found for userId: ${userId}` };
  }

  async calculateCartSummary(userId: string): Promise<any> {
    const userCart = await this.cartRepository.findCartByUserId(userId);
    if (!userCart) {
      logger.warn("Cart not found");
      throw AppError.notFound("Cart not found", userId);
    }
    let subtotal = 0;
    for (const item of userCart.items) {
      const product = await this.productService.getProductById(item.productId);
      if (this.isProduct(product)) {
        subtotal += product.price * item.quantity;
      }
    }
    const shipping = 10.00;
    const vat = subtotal * 0.13;
    const total = subtotal + shipping + vat;
    return {
      subtotal,
      shipping,
      vat,
      total,
    };
  }

  async getAllCarts(): Promise<Cart[]> {
    return await this.cartRepository.getAll();
  }

  async getCartByUserId(userId: string): Promise<any> {
    const userCart = await this.cartRepository.findCartByUserId(userId);
    if (!userCart) {
      logger.warn("Cart not found");
      throw AppError.notFound("Cart not found", userId);
    }
    return userCart;
  }
}
