import { Product } from '../types/productTypes';
import { CartRepository } from '../repository/cartRepo';
import { ProductService } from './productService';
import { Cart } from '../types/cartTypes';

export class CartService {
  private cartRepo: CartRepository;
  private productService: ProductService;

  constructor() {
    this.cartRepo = new CartRepository();
    this.productService = new ProductService();
  }

  // Helper function to check if an object is a valid Product
  private isProduct(product: any): product is Product {
    return product && typeof product.id === 'number' && typeof product.price === 'number';
  }

  // Create or update a cart with an item
  createCart(item: Product, quantity: number, userId: number) {
    const product = this.productService.getProductById(item.id);

    if (!this.isProduct(product)) {
      return { message: "Product not found" };
    }

    const cartData = {
      userId,
      items: [{ productId: item.id, quantity }],
    };

    const userCart = this.cartRepo.findCartByUserId(userId);

    if (!userCart) {
      this.cartRepo.addCart(cartData);
    } else {
      const userCartItemIndex = userCart.items.findIndex(
        cartItem => cartItem.productId === product.id
      );

      if (userCartItemIndex === -1) {
        userCart.items.push({ productId: item.id, quantity });
      } else {
        userCart.items[userCartItemIndex].quantity += quantity;
      }

      this.cartRepo.updateCart(userId, userCart.items);
    }

    this.productService.decreaseQuantity(product.id, quantity);
    return { message: 'Product added to cart successfully' };
  }

  // Remove a product from the cart
  removeFromCart(productId: number, userId: number) {
    const userCart = this.cartRepo.findCartByUserId(userId);

    if (!userCart) {
      return { message: `Cart not found for userId: ${userId}` };
    }

    const itemIndex = userCart.items.findIndex(item => item.productId === productId);
    if (itemIndex !== -1) {
      userCart.items.splice(itemIndex, 1);
    }

    this.cartRepo.saveCarts();
    return { message: 'Product removed from cart successfully' };
  }

  removeCartByUserId(userId: number) {
    const removed = this.cartRepo.removeCartByUserId(userId);
    return removed
      ? { message: 'Cart removed successfully' }
      : { message: `Cart not found for userId: ${userId}` };
  }

  // Calculate total cost of items in the cart
  calculateTotal(userId: number) {
    const userCart = this.cartRepo.findCartByUserId(userId);

    if (!userCart) {
      return { message: `Cart not found for userId: ${userId}` };
    }

    const total = userCart.items.reduce((acc: number, current) => {
      const product = this.productService.getProductById(current.productId);
      if (this.isProduct(product)) {
        acc += product.price * current.quantity;
      }
      return acc;
    }, 0);

    return { total };
  }

  // Get cart details by userId
  getCartByUserId(userId: number) {
    const userCart = this.cartRepo.findCartByUserId(userId);
    return userCart || { message: `Cart not found for userId: ${userId}` };
  }
}
