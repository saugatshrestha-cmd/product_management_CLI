import { injectable } from "tsyringe";
import { OrderModel } from '@models/orderModel';
import { Order, OrderInput } from '@mytypes/orderTypes';
import { OrderItemStatus } from "@mytypes/enumTypes";
import { OrderRepository } from "@mytypes/repoTypes";

@injectable()
export class MongoOrderRepository implements OrderRepository {

  async getAll(): Promise<Order[]> {
    return await OrderModel.find({ isDeleted: false });
  }

  async findById(orderId: string): Promise<Order | null> {
    return await OrderModel.findOne({ _id: orderId, isDeleted: false });
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    return await OrderModel.find({ userId, isDeleted: false }).select('-isDeleted -deletedAt');
  }

  async getOrderBySellerId(sellerId: string): Promise<Order[]> {
    return await OrderModel.find({ isDeleted: false })
  }

  async add(orderData: OrderInput): Promise<Order> {
    const newOrder = new OrderModel(orderData);
    await newOrder.save();
    return newOrder.toObject() as Order;
  }

  async update(orderId: string, updatedInfo: Partial<Order>): Promise<void> {
      const result = await OrderModel.updateOne({ _id: orderId }, { $set: updatedInfo });
    }
  
  async updateOrderItemStatus(orderId: string, itemId: string, sellerId: string, newStatus: OrderItemStatus): Promise<void> {
    await OrderModel.updateOne(
      { _id: orderId, 'items._id': itemId, 'items.sellerId': sellerId },
      { $set: { 'items.$.status': newStatus } }
    );
  }
}
