import { OrderModel } from '../../models/orderModel';
import { Order } from '../../types/orderTypes';

export class OrderRepository {

  private async getNewId(): Promise<number> {
    const lastOrder = await OrderModel.findOne().sort({ id: -1 });
    return lastOrder ? lastOrder.id + 1 : 1;
  }

  async getAll(): Promise<Order[]> {
    return await OrderModel.find();
  }

  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return await OrderModel.find({ userId });
  }

  async findOrderById(orderId: number): Promise<Order | null> {
    return await OrderModel.findOne({ id: orderId });
  }

  async addOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    const newId = await this.getNewId();
    const newOrder = new OrderModel({ id: newId, ...orderData });
    return await newOrder.save();
  }

  async updateOrder(orderId: number, updatedInfo: Partial<Order>): Promise<void> {
      await OrderModel.updateOne({ id: orderId }, updatedInfo);
    }
}
