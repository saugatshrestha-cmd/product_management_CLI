import { injectable, inject } from "tsyringe";
import { OrderRepository } from '@repository/orderRepo';
import { CartService } from '@services/cartService';
import { ProductService } from '@services/productService';
import { Order, OrderItemInput, SellerOrder } from '@mytypes/orderTypes';
import { AppError } from "@utils/errorHandler";
import { Status, OrderItemStatus } from '@mytypes/enumTypes';
import { CartItem } from '@mytypes/cartTypes';

@injectable()
export class OrderService {

  constructor(
    @inject("OrderRepository") private orderRepo: OrderRepository,
    @inject("CartService") private cartService: CartService,
    @inject("ProductService") private productService: ProductService
  ) {}

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
          quantity: item.quantity,
          price: product.price,
          sellerId: item.sellerId,
          status: OrderItemStatus.PENDING, // Or any appropriate initial order item status
        };
      })
    );

    for (const item of cart.items as CartItem[]) {
      await this.productService.decreaseQuantity(item.productId, item.quantity);
    }

    await this.orderRepo.addOrder({
      userId,
      items: orderItems as OrderItemInput[],
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

  async getOrderByUserId(userId: string): Promise<{ message: string } | Order[]> {
    const userOrders = await this.orderRepo.getOrdersByUserId(userId);

    if (userOrders.length === 0) {
      throw AppError.notFound(`No orders found for userId: ${userId}` );
    }

    return userOrders;
  }

  async getOrderBySellerId(sellerId: string): Promise<{ message: string } | SellerOrder[] > {
    const allOrders = await this.orderRepo.getAll();
  
    const filteredOrders: SellerOrder[] = allOrders
      .map(order => ({
        _id: order._id,
        userId: order.userId,
        timestamp: order.timestamp,
        items: order.items.filter(item => item.sellerId === sellerId)
      }))
      .filter(order => order.items.length > 0); // Only keep orders where this seller has products
  
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
    const order = await this.orderRepo.findOrderById(orderId);
    
    if (!order) {
      return { message: `Order with id ${orderId} not found.` };
    }
    
    // Find the specific item in the order
    const itemToUpdate = order.items.find(item => 
      item._id.toString() === itemId && item.sellerId === sellerId
    );
    
    if (!itemToUpdate) {
      throw AppError.notFound(`Item not found.` );
    }

    if (newStatus === OrderItemStatus.CANCELLED && itemToUpdate.status !== OrderItemStatus.PENDING) {
      return { message: `Only items with status 'PENDING' can be cancelled.` };
    }
  
    if (newStatus === OrderItemStatus.CANCELLED) {
      await this.productService.increaseQuantity(itemToUpdate.productId, itemToUpdate.quantity);
    }
  
    await this.orderRepo.updateOrderItemStatus(orderId, itemId, sellerId, newStatus);

    const updatedItems = order.items.map(item => {
      if (item._id.toString() === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });

    await this.orderRepo.updateOrderItemStatus(orderId, itemId, sellerId, newStatus);

    const itemStatuses = updatedItems.map(item => item.status);
    const newOrderStatus = this.updateOverallOrderStatus(itemStatuses);

    if (newOrderStatus !== order.status) {
      await this.orderRepo.updateOrder(orderId, { status: newOrderStatus });
    }
    
    return { message: `Item status updated to ${newStatus} successfully` };
  }

  

  async updateOrderStatus(orderId: string, updatedInfo: Partial<Order>): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);

    if (!order) {
      throw AppError.notFound(`Order with id ${orderId} not found.`);
    }
    await this.orderRepo.updateOrder(orderId, updatedInfo);

    return { message: "Order status updated successfully" };
  }

  async cancelOrder(orderId: string, userId: string): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);
    if (!order) throw AppError.notFound( "Order not found" );
  
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

  async deleteOrder(orderId: string): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);
    if (!order) throw AppError.notFound("Order not found" );
  
    if (order.isDeleted) return { message: "Order already deleted" };

    if (order.status !== Status.PENDING && order.status !== Status.CANCELLED) {
      return { message: `Cannot delete order. Only 'Pending' or 'Cancelled' orders can be deleted.` };
    }
  
    await this.orderRepo.updateOrder(orderId, {
      isDeleted: true,
      deletedAt: new Date()
    });
  
    return { message: "Order deleted successfully" };
  }
  
  
}
