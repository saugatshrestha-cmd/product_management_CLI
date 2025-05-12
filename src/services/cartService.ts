import { injectable, inject } from "tsyringe";
import { Product } from '@mytypes/productTypes';
import { CartRepository } from '@mytypes/repoTypes';
import { AppError } from "@utils/errorHandler";
import { ProductService } from '@services/productService';
import { Cart } from '@mytypes/cartTypes';
import { CartRepositoryFactory } from "@factories/cartFactory";
import { logger } from "@utils/logger";
import { AuditService } from "./auditService";
import { Request } from "express";

@injectable()
export class CartService {
  private cartRepository: CartRepository;
  constructor(
    @inject(CartRepositoryFactory) private CartRepositoryFactory: CartRepositoryFactory,
    @inject("ProductService") private productService: ProductService,
    @inject("AuditService") private auditService: AuditService
  ) {
    this.cartRepository = this.CartRepositoryFactory.getRepository();
  }

  private isProduct(product: any): product is Product {
    return product && typeof product._id === 'object' && product.sellerId;
  }

  async createCart(productId: string, quantity: number, userId: string, req?: Request): Promise<{ message: string }> {
    try{ 
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
      const newCart = await this.cartRepository.add({
        userId,
        items: [{ productId: product._id, productName: product.name, quantity, sellerId: product.sellerId }],
      });
      await this.auditService.logAudit({
        action: 'add_to_cart',
        entity: 'Cart',
        entityId: newCart._id,
        userId,
        status: 'success',
        message: 'Product added to cart successfully',
        req
      });
    } else {
      const productInCart = userCart.items.find(
        item => item.productId.toString() === product._id.toString()
      );
      if (productInCart) {
        throw AppError.conflict("Product already in cart");
      }
      userCart.items.push({ productId: product._id, productName: product.name, quantity, sellerId: product.sellerId });
      await this.cartRepository.updateCart(userId, userCart.items);
      await this.auditService.logAudit({
        action: 'add_to_cart',
        entity: 'Cart',
        entityId: userCart._id,
        userId,
        status: 'success',
        message: 'Product added to cart successfully',
        req
      });
    }
    
    return { message: 'Product added to cart successfully' };
    } catch(error){
      await this.auditService.logAudit({
        action: 'add_to_cart',
        entity: 'Cart',
        entityId: userId,
        userId,
        status: 'failed',
        message: 'Failed to add product to cart',
        req
      });
      logger.error("Unexpected error while creating cart", error);
      throw AppError.internal("Something went wrong while creating the cart");
    }
  }

  async updateItemQuantity(userId: string, productId: string, quantity: number, req?: Request): Promise<{ message: string }> {
    try{if (quantity <= 0) {
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
    const beforeState = {
      quantity: cart.items[itemIndex].quantity,
      items: [...cart.items] // Clone array for snapshot
    };
    cart.items[itemIndex].quantity = quantity;
    await this.cartRepository.updateCart(userId, cart.items);
    const afterState = {
      quantity: cart.items[itemIndex].quantity,
      items: [...cart.items] // Clone array for snapshot
    };
    await this.auditService.logAudit({
        action: 'update_cart_quantity',
        entity: 'Cart',
        entityId: cart._id,
        userId,
        status: 'success',
        beforeState, // Now included
        afterState,
        message: 'Product quantity updated successfully',
        req
      });
    return { message: "Product quantity updated successfully" };
  } catch(error){
    await this.auditService.logAudit({
        action: 'update_cart',
        entity: 'Cart',
        entityId: userId,
        userId,
        status: 'failed',
        message: 'Failed to update quantity',
        req
      });
      logger.error("Unexpected error while updating cart", error);
      throw AppError.internal("Something went wrong while updating the cart");
  }
  }      

  async removeFromCart(productId: string, userId: string, req?: Request): Promise<{ message: string }> {
    try
    {
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
    await this.auditService.logAudit({
          action: 'remove_from_cart',
          entity: 'Cart',
          entityId: userCart._id,
          userId,
          status: 'success',
          message: 'Product removed from cart successfully',
          req
        });
    return { message: 'Product removed from cart successfully' };
  }catch(error){
    await this.auditService.logAudit({
        action: 'remove_from_cart',
        entity: 'Cart',
        entityId: userId,
        userId,
        status: 'failed',
        message: 'Failed to remove product from cart',
        req
      });
      logger.error("Unexpected error while removing product from cart", error);
      throw AppError.internal("Something went wrong while removing product from the cart");
  }
  }

  async removeCartByUserId(userId: string, req?: Request): Promise<{ message: string }> {
    const removed = await this.cartRepository.removeCartByUserId(userId);
    await this.auditService.logAudit({
        action: 'clear_cart',
        entity: 'Cart',
        entityId: userId,
        userId,
        status: removed ? 'success' : 'failed',
        message: removed 
          ? 'Cart cleared successfully' 
          : 'Cart not found',
        req
      });
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
