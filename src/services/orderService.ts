import { injectable, inject } from "tsyringe";
import { OrderRepository } from '../repository/mongo_repo/orderRepo';
import { CartService } from './cartService';
import { ProductService } from './productService';
import { Order, OrderItemInput, SellerOrder } from '../types/orderTypes';
import { Status, OrderItemStatus } from '../types/enumTypes';
import { CartItem } from '../types/cartTypes';

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
          throw new Error(`Product not found or error: ${product.message}`);
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
      return { message: `No orders found for userId: ${userId}` };
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
        isDeleted: order.isDeleted,
        items: order.items.filter(item => item.sellerId === sellerId)
      }))
      .filter(order => order.items.length > 0); // Only keep orders where this seller has products
  
    if (filteredOrders.length === 0) {
      return { message: `No orders found for sellerId: ${sellerId}` };
    }
  
    return filteredOrders;
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
      return { message: `Item not found or you don't have permission to update this item.` };
    }
    
    // Update the status of the specific item
    const updatedItems = order.items.map(item => {
      if (item._id.toString() === itemId) {
        return { ...item, status: newStatus };
      }
      return item;
    });
    
    // Update the order with the modified items array
    await this.orderRepo.updateOrderItemStatus(orderId, itemId, sellerId, newStatus);
    
    return { message: `Item status updated to ${newStatus} successfully` };
  }

  

  async updateOrderStatus(orderId: string, updatedInfo: Partial<Order>): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);

    if (!order) {
      return { message: `Order with id ${orderId} not found.` };
    }
    await this.orderRepo.updateOrder(orderId, updatedInfo);

    return { message: "Order status updated successfully" };
  }

  async cancelOrder(orderId: string, userId: string): Promise<{ message: string }> {
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

  async deleteOrder(orderId: string): Promise<{ message: string }> {
    const order = await this.orderRepo.findOrderById(orderId);
    if (!order) return { message: "Order not found" };
  
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
