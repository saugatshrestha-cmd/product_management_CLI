import { injectable, inject } from "tsyringe";
import { Product } from '@mytypes/productTypes';
import { CartRepository } from '@repository/cartRepo';
import { ProductService } from '@services/productService';
import { Cart } from '@mytypes/cartTypes';

@injectable()
export class CartService {

  constructor(
    @inject("CartRepository") private cartRepo: CartRepository,
    @inject("ProductService") private productService: ProductService
  ) {}

  private isProduct(product: any): product is Product {
    return product && typeof product._id === 'object' && product.sellerId;
  }

  async createCart(productId: string, quantity: number, userId: string): Promise<{ message: string }> {
    const product = await this.productService.getProductById(productId);

    if (!this.isProduct(product)) {
      return { message: "Product not found" };
    }

    const userCart = await this.cartRepo.findCartByUserId(userId);

    if (!userCart) {
      await this.cartRepo.addCart({
        userId,
        items: [{ productId: product._id, quantity, sellerId: product.sellerId }],
      });
    } else {
      const productInCart = userCart.items.find(
        item => item.productId.toString() === product._id.toString()
      );
      if (productInCart) {
        return { message: 'Product is already in the cart' };
      }
      
      userCart.items.push({ productId: product._id, quantity, sellerId: product.sellerId });
      await this.cartRepo.updateCart(userId, userCart.items);
    }

    return { message: 'Product added to cart successfully' };
  }

  async updateItemQuantity(userId: string, productId: string, amount: number): Promise<{ message: string }> {
    if (amount <= 0) {
      return { message: "Amount must be greater than zero" }; // You can adjust the condition to allow only positive numbers.
    }
  
    const cart = await this.cartRepo.findCartByUserId(userId);
    if (!cart) {
      return { message: "Cart not found" };
    }
  
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
    if (itemIndex === -1) {
      return { message: "Product not in cart" };
    }
  
    // Replace the current quantity with the new amount
    cart.items[itemIndex].quantity = amount;
  
    await this.cartRepo.updateCart(userId, cart.items);
  
    return { message: "Product quantity updated successfully" };
  }    

  async removeFromCart(productId: string, userId: string): Promise<{ message: string }> {
    const userCart = await this.cartRepo.findCartByUserId(userId);

    if (!userCart) {
      return { message: `Cart not found for userId: ${userId}` };
    }

    const itemIndex = userCart.items.findIndex(item => item.productId === productId);
    if (itemIndex !== -1) {
      userCart.items.splice(itemIndex, 1);
      await this.cartRepo.updateCart(userId, userCart.items);
    }

    return { message: 'Product removed from cart successfully' };
  }

  async removeCartByUserId(userId: string): Promise<{ message: string }> {
    const removed = await this.cartRepo.removeCartByUserId(userId);
    return removed
      ? { message: 'Cart removed successfully' }
      : { message: `Cart not found for userId: ${userId}` };
  }

  async calculateCartSummary(userId: string): Promise<any> {
    const userCart = await this.cartRepo.findCartByUserId(userId);
  
    if (!userCart) {
      return { message: `Cart not found for userId: ${userId}` };
    }
  
    let subtotal = 0;
    for (const item of userCart.items) {
      const product = await this.productService.getProductById(item.productId);
      if (this.isProduct(product)) {
        subtotal += product.price * item.quantity;
      }
    }
  
    // Calculate shipping cost
    const shipping = 10.00;
  
    // Calculate VAT (13%)
    const vat = subtotal * 0.13;
  
    // Calculate total (including shipping and VAT)
    const total = subtotal + shipping + vat;
  
    return {
      subtotal,
      shipping,
      vat,
      total,
    };
  }

  async getAllCarts(): Promise<Cart[]> {
    return await this.cartRepo.getAll();
  }

  async getCartByUserId(userId: string): Promise<any> {
    const userCart = await this.cartRepo.findCartByUserId(userId);
    return userCart || { message: `Cart not found for userId: ${userId}` };
  }
}
