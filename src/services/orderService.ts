import { OrderRepository } from '../repository/cli_repo/orderRepo';
import { CartService } from './cartService';
import { OrderStatus } from '../types/orderTypes';
import { CartItem } from '../types/cartTypes';

export class OrderService {
  private orderRepo: OrderRepository;
  private cartService: CartService;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartService = new CartService();
  }

  // Create a new order
  createOrder(userId: number) {
    const cart = this.cartService.getCartByUserId(userId);

    if ('message' in cart) {
      return { message: `Cannot place order: ${cart.message}` };
    }

    const totalResult = this.cartService.calculateTotal(userId);
    if ('message' in totalResult) {
      return { message: `Cannot calculate total: ${totalResult.message}` };
    }

    const order = this.orderRepo.addOrder({
      userId,
      items: cart.items as CartItem[],
      total: totalResult.total,
      timestamp: new Date(),
      status: OrderStatus.PENDING,
    });

    this.cartService.removeCartByUserId(userId);

    return { message: "Order created successfully" };
  }

  // Get all orders for a specific user
  getOrderByUserId(userId: number) {
    const userOrders = this.orderRepo.getOrdersByUserId(userId);

    if (userOrders.length === 0) {
      return { message: `No orders found for userId: ${userId}` };
    }

    return userOrders;
  }

  // Update the status of an order
  updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    const order = this.orderRepo.findOrderById(orderId);

    if (!order) {
      return { message: `Order with id ${orderId} not found.` };
    }

    order.status = newStatus;
    this.orderRepo.saveOrders();

    return { message: "Order status updated" };
  }
}
