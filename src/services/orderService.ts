import { injectable, inject } from "tsyringe";
import { OrderRepository, UserRepository } from '@mytypes/repoTypes';
import { CartService } from '@services/cartService';
import { ProductService } from '@services/productService';
import { Order, OrderItemInput, SellerOrder } from '@mytypes/orderTypes';
import { AppError } from "@utils/errorHandler";
import { Status, OrderItemStatus } from '@mytypes/enumTypes';
import { CartItem } from '@mytypes/cartTypes';
import { OrderRepositoryFactory } from "@factories/orderFactory";
import { logger } from "@utils/logger";
import { NotificationService } from "./notificationService";
import { UserRepositoryFactory } from "@factories/userFactory";

@injectable()
export class OrderService {
  private orderRepository: OrderRepository;
  private userRepository: UserRepository;
  constructor(
    @inject("OrderRepositoryFactory") private orderRepositoryFactory: OrderRepositoryFactory,
    @inject("UserRepositoryFactory") private userRepositoryFactory: UserRepositoryFactory,
    @inject("CartService") private cartService: CartService,
    @inject("ProductService") private productService: ProductService,
    @inject("NotificationService") private notificationService: NotificationService
  ) {
    this.orderRepository = this.orderRepositoryFactory.getRepository();
    this.userRepository = this.userRepositoryFactory.getRepository();
  }

  async createOrder(userId: string): Promise<{ message: string }> {
    const cart = await this.cartService.getCartByUserId(userId);
    if ('message' in cart) {
      return { message: `Cannot place order: ${cart.message}` };
    }
    const totalResult = await this.cartService.calculateCartSummary(userId);
    if ('message' in totalResult) {
      return { message: `Cannot calculate total: ${totalResult.message}` };
    }
    const orderItems = await Promise.all(
      (cart.items as CartItem[]).map(async (item) => {
        const product = await this.productService.getProductById(item.productId);
        if ('message' in product) {
          throw AppError.notFound(`Product not found or error: ${product.message}`);
        }
        return {
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          price: product.price,
          sellerId: item.sellerId,
          status: OrderItemStatus.PENDING,
        };
      })
    );
    for (const item of cart.items as CartItem[]) {
      await this.productService.decreaseQuantity(item.productId, item.quantity);
    }
    const newOrder = await this.orderRepository.add({
      userId,
      items: orderItems as OrderItemInput[],
      total: totalResult.total,
      timestamp: new Date(),
      status: Status.PENDING,
    });
    this.cartService.removeCartByUserId(userId);
    const user = await this.userRepository.findById(userId);
  if (!user) {
    throw AppError.notFound(`User with id ${userId} not found.`);
  }
  const productNames = (newOrder.items as OrderItemInput[]).map(item => item.productName).join(', ');
  await this.notificationService.sendOrderConfirmation(newOrder, user, productNames);
    return { message: "Order created successfully" };
  }

  async getAllOrders(): Promise<Order[]> {
      return await this.orderRepository.getAll();
    }
  async getOrderByUserId(userId: string): Promise<{ message: string } | Order[]> {
    const userOrders = await this.orderRepository.getOrdersByUserId(userId);
    if (userOrders.length === 0) {
      throw AppError.notFound(`No orders found for userId: ${userId}` );
    }
    return userOrders;
  }

  async getOrderBySellerId(sellerId: string): Promise<{ message: string } | SellerOrder[] > {
    const allOrders = await this.orderRepository.getAll();
    const filteredOrders: SellerOrder[] = allOrders
      .map(order => ({
        _id: order._id,
        userId: order.userId,
        timestamp: order.timestamp,
        items: order.items.filter(item => item.sellerId === sellerId)
      }))
      .filter(order => order.items.length > 0); 
    if (filteredOrders.length === 0) {
      throw AppError.notFound( `No orders found for sellerId: ${sellerId}` );
    }
    return filteredOrders;
  }

  private updateOverallOrderStatus(itemStatuses: OrderItemStatus[]): Status {
    const allDelivered = itemStatuses.every(s => s === OrderItemStatus.DELIVERED);
    const allShippedOrDelivered = itemStatuses.every(
      s => s === OrderItemStatus.SHIPPED || s === OrderItemStatus.DELIVERED
    );
    const allCancelled = itemStatuses.every(s => s === OrderItemStatus.CANCELLED)
    const someDelivered = itemStatuses.includes(OrderItemStatus.DELIVERED);
    const someShipped = itemStatuses.includes(OrderItemStatus.SHIPPED);
    if (allDelivered) return Status.DELIVERED;
    if (allCancelled) return Status.CANCELLED;
    if (someDelivered) return Status.PARTIALLYDELIVERED;
    if (someShipped && !allShippedOrDelivered) return Status.PARTIALLYSHIPPED;
    if (allShippedOrDelivered) return Status.SHIPPED;
    return Status.PENDING;
  }

  async updateOrderItemStatus(
    orderId: string, 
    itemId: string, 
    sellerId: string, 
    newStatus: OrderItemStatus
  ): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      return { message: `Order with id ${orderId} not found.` };
    }
    const itemToUpdate = order.items.find(item => 
      item._id.toString() === itemId && item.sellerId === sellerId
    );
    if (!itemToUpdate) {
      throw AppError.notFound(`Item not found.` );
    }
    const productName = itemToUpdate.productName;
    if (newStatus === OrderItemStatus.CANCELLED && itemToUpdate.status !== OrderItemStatus.PENDING) {
      return { message: `Only items with status 'PENDING' can be cancelled.` };
    }
    if (newStatus === OrderItemStatus.CANCELLED) {
      await this.productService.increaseQuantity(itemToUpdate.productId, itemToUpdate.quantity);
    }
    await this.orderRepository.updateOrderItemStatus(orderId, itemId, sellerId, newStatus);
    const updatedItems = order.items.map(item => {
      if (item._id.toString() === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    await this.orderRepository.updateOrderItemStatus(orderId, itemId, sellerId, newStatus);
    const user = await this.userRepository.findById(order.userId); 
    if (!user) {
      throw AppError.notFound(`User with id ${order.userId} not found.`);
    }
    if (newStatus === OrderItemStatus.SHIPPED) {
      await this.notificationService.sendOrderShippedNotification(order, user, productName);
    }
    const itemStatuses = updatedItems.map(item => item.status);
    const newOrderStatus = this.updateOverallOrderStatus(itemStatuses);
    if (newOrderStatus !== order.status) {
      await this.orderRepository.update(orderId, { status: newOrderStatus });
    }
    
    return { message: `Item status updated to ${newStatus} successfully` };
  }

  async updateOrderStatus(orderId: string, updatedInfo: Partial<Order>): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw AppError.notFound(`Order with id ${orderId} not found.`);
    }
    await this.orderRepository.update(orderId, updatedInfo);
    return { message: "Order status updated successfully" };
  }

  async cancelOrder(orderId: string, userId: string): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw AppError.notFound( "Order not found" );
    if (order.userId !== userId) return { message: "Unauthorized to cancel this order" };
    if (order.status !== Status.PENDING) return { message: "Only pending orders can be cancelled" };
    for (const item of order.items) {
      await this.productService.increaseQuantity(item.productId, item.quantity);
    }
    await this.orderRepository.update(orderId, {
      status: Status.CANCELLED,
      cancelledAt: new Date(),
    });
    return { message: "Order cancelled successfully" };
  }

  async cancelOrderAdmin(orderId: string): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw AppError.notFound( "Order not found" );
    if (order.status !== Status.PENDING && order.status !== Status.SHIPPED) return { message: "Only pending and shipped orders can be cancelled" };
    for (const item of order.items) {
      await this.productService.increaseQuantity(item.productId, item.quantity);
    }
    await this.orderRepository.update(orderId, {
      status: Status.CANCELLED,
      cancelledAt: new Date(),
    });
    return { message: "Order cancelled successfully" };
  }
  
  async deleteOrder(orderId: string, userId: string): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw AppError.notFound("Order not found" );
    if (order.userId !== userId) return { message: "Unauthorized to cancel this order" };
    if (order.isDeleted) return { message: "Order already deleted" };
    if (order.status !== Status.PENDING && order.status !== Status.CANCELLED && order.status !== Status.DELIVERED) {
      return { message: `Cannot delete order. Only 'Pending' or 'Cancelled' orders can be deleted.` };
    }
    await this.orderRepository.update(orderId, {
      isDeleted: true,
      deletedAt: new Date()
    });
    return { message: "Order deleted successfully" };
  }

  async deleteOrderByUserId(userId: string): Promise<{ message: string }> {
    const orders = await this.orderRepository.getOrdersByUserId(userId);
    if (!orders) throw AppError.notFound("Order not found" );
    await Promise.all(
      orders.map(order =>
        this.orderRepository.update(order._id, {
          isDeleted: true,
          deletedAt: new Date(),
        })
      )
    );
    return { message: "Order deleted successfully" };
  }

  async deleteOrderAdmin(orderId: string): Promise<{ message: string }> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw AppError.notFound("Order not found" );
    if (order.isDeleted) return { message: "Order already deleted" };
    await this.orderRepository.update(orderId, {
      isDeleted: true,
      deletedAt: new Date()
    });
    return { message: "Order deleted successfully" };
  }
  
  
}
