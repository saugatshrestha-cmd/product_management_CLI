import { injectable } from "tsyringe";
import { OrderModel } from '../../models/orderModel';
import { Order, OrderInput } from '../../types/orderTypes';
import { OrderItemStatus } from "../../types/enumTypes";

@injectable()
export class OrderRepository {

  async getAll(): Promise<Order[]> {
    return await OrderModel.find({ isDeleted: false });
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await OrderModel.find({ userId, isDeleted: false });
  }

  async getOrderBySellerId(sellerId: string): Promise<Order[]> {
    return await OrderModel.find({ isDeleted: false })
  }

  async findOrderById(orderId: string): Promise<Order | null> {
    return await OrderModel.findOne({ _id: orderId, isDeleted: false });
  }

  async addOrder(orderData: OrderInput): Promise<void> {
    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    return;
  }

  async updateOrder(orderId: string, updatedInfo: Partial<Order>): Promise<void> {
      const result = await OrderModel.updateOne({ _id: orderId }, { $set: updatedInfo });
      console.log("Update Result:", result);
    }
  
    async updateOrderItemStatus(orderId: string, itemId: string, sellerId: string, newStatus: OrderItemStatus): Promise<void> {
      await OrderModel.updateOne(
        { _id: orderId, 'items._id': itemId, 'items.sellerId': sellerId },
        { $set: { 'items.$.status': newStatus } }
      );
    }
}
