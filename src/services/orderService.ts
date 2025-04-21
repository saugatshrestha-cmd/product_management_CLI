import { OrderRepository } from '../repository/mongo_repo/orderRepo';
import { CartService } from './cartService';
import { ProductService } from './productService';
import { Order } from '../types/orderTypes';
import { Status } from '../types/enumTypes';
import { CartItem } from '../types/cartTypes';

export class OrderService {
  private orderRepo: OrderRepository;
  private cartService: CartService;
  private productService: ProductService;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartService = new CartService();
    this.productService = new ProductService();
  }

  async createOrder(userId: number): Promise<{ message: string }> {
    const cart = await this.cartService.getCartByUserId(userId);

    if ('message' in cart) {
      return { message: `Cannot place order: ${cart.message}` };
    }

    const totalResult = await this.cartService.calculateCartSummary(userId);
    if ('message' in totalResult) {
      return { message: `Cannot calculate total: ${totalResult.message}` };
    }

    for (const item of cart.items as CartItem[]) {
      await this.productService.decreaseQuantity(item.productId, item.quantity);
    }

    await this.orderRepo.addOrder({
      userId,
      items: cart.items as CartItem[],
      total: totalResult.total,
      timestamp: new Date(),
      status: Status.PENDING,
    });

    this.cartService.removeCartByUserId(userId);

    return { message: "Order created successfully" };
  }

  async getAllOrders(): Promise<Order[]> {
      return await this.orderRepo.getAll();
    }

  async getOrderByUserId(userId: number): Promise<{ message: string } | Order[]> {
    const userOrders = await this.orderRepo.getOrdersByUserId(userId);

    if (userOrders.length === 0) {
      return { message: `No orders found for userId: ${userId}` };
    }

    return userOrders;
  }

  async updateOrderStatus(orderId: number, updatedInfo: Partial<Order>): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);

    if (!order) {
      return { message: `Order with id ${orderId} not found.` };
    }
    await this.orderRepo.updateOrder(orderId, updatedInfo);

    return { message: "Order status updated successfully" };
  }

  async cancelOrder(orderId: number, userId: number): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);
    if (!order) return { message: "Order not found" };
  
    if (order.userId !== userId) return { message: "Unauthorized to cancel this order" };
  
    if (order.status !== Status.PENDING) return { message: "Only pending orders can be cancelled" };
  
    // Restock items
    for (const item of order.items) {
      await this.productService.increaseQuantity(item.productId, item.quantity);
    }
  
    // Update order
    await this.orderRepo.updateOrder(orderId, {
      status: Status.CANCELLED,
      cancelledAt: new Date(),
    });
  
    return { message: "Order cancelled successfully" };
  }

  async deleteOrder(orderId: number): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);
    if (!order) return { message: "Order not found" };
  
    if (order.isDeleted) return { message: "Order already deleted" };

    if (order.status !== Status.PENDING) {
      return { message: `Cannot delete order. Only 'Pending' orders can be deleted.` };
    }
  
    await this.orderRepo.updateOrder(orderId, {
      isDeleted: true,
      deletedAt: new Date()
    });
  
    return { message: "Order deleted successfully" };
  }
  
  
}
