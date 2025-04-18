import { Product } from '../types/productTypes';
import { CartRepository } from '../repository/mongo_repo/cartRepo';
import { ProductService } from './productService';
import { Cart } from '../types/cartTypes';

export class CartService {
  private cartRepo: CartRepository;
  private productService: ProductService;

  constructor() {
    this.cartRepo = new CartRepository();
    this.productService = new ProductService();
  }

  private isProduct(product: any): product is Product {
    return product && typeof product.id === 'number' && typeof product.price === 'number';
  }

  async createCart(item: Product, quantity: number, userId: number): Promise<{ message: string }> {
    const product = await this.productService.getProductById(item.id);

    // If the product is not found, return a message indicating failure
    if (!this.isProduct(product)) {
      return { message: "Product not found" };
    }

    // Check if the product is already in the user's cart
    const userCart = await this.cartRepo.findCartByUserId(userId);

    if (!userCart) {
      // If no cart exists, create a new one
      await this.cartRepo.addCart({
        userId,
        items: [{ productId: product.id, quantity, price: product.price }],
      });
    } else {
      // If cart exists, add a new item
      const userCartItemIndex = userCart.items.findIndex(
        cartItem => cartItem.productId === product.id
      );

      if (userCartItemIndex === -1) {
        userCart.items.push({ productId: product.id, quantity, price: product.price });
      }

      await this.cartRepo.updateCart(userId, userCart.items);
    }

    return { message: 'Product added to cart successfully' };
  }

  async updateItemQuantity(userId: number, productId: number, amount: number): Promise<{ message: string }> {
    if (amount === 0) {
      return { message: "Amount must not be zero" };
    }
  
    const cart = await this.cartRepo.findCartByUserId(userId);
    if (!cart) {
      return { message: "Cart not found" };
    }
  
    const itemIndex = cart.items.findIndex(item => item.productId === productId);
  
    if (itemIndex === -1) {
      return { message: "Product not in cart" };
    }
  
    // Update the quantity by adding or subtracting the amount
    const updatedQty = cart.items[itemIndex].quantity + amount;
  
    // Ensure the quantity doesn't go below zero
    if (updatedQty < 0) {
      return { message: "Quantity cannot be negative" };
    }
  
    cart.items[itemIndex].quantity = updatedQty;
    await this.cartRepo.updateCart(userId, cart.items);
  
    return { message: "Product quantity updated successfully" };
  }    
  

  async removeFromCart(productId: number, userId: number): Promise<{ message: string }> {
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

  async removeCartByUserId(userId: number): Promise<{ message: string }> {
    const removed = await this.cartRepo.removeCartByUserId(userId);
    return removed
      ? { message: 'Cart removed successfully' }
      : { message: `Cart not found for userId: ${userId}` };
  }

  async calculateCartSummary(userId: number): Promise<any> {
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

  async getCartByUserId(userId: number): Promise<any> {
    const userCart = await this.cartRepo.findCartByUserId(userId);
    return userCart || { message: `Cart not found for userId: ${userId}` };
  }
}
