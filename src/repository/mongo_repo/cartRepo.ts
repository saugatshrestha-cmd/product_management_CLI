import { injectable } from "tsyringe";
import { CartModel } from '@models/cartModel';
import { Cart, CartItem, CartInput } from '@mytypes/cartTypes';
import { CartRepository } from "@mytypes/repoTypes";

@injectable()
export class MongoCartRepository implements CartRepository {

  async getAll(): Promise<Cart[]> {
    return await CartModel.find();
  }

  async findById(id: string): Promise<Cart | null> {
    return await CartModel.findById(id);
  }

  async findCartByUserId(userId: string): Promise<Cart | null> {
    return await CartModel.findOne({ userId });
  }

  async add(cartData: CartInput): Promise<void> {
    const newCart = new CartModel(cartData);
    await newCart.save();
  }

  async update(id: string, updatedInfo: Partial<Cart>): Promise<void> {
    await CartModel.findByIdAndUpdate(id, updatedInfo);
  }

  async updateCart(userId: string, updatedItems: CartItem[]): Promise<void> {
    await CartModel.findOneAndUpdate(
      { userId },
      { $set: { items: updatedItems } },
      { new: true }
    );
  }

  async removeCartByUserId(userId: string): Promise<boolean> {
    const result = await CartModel.deleteOne({ userId });
    return result.deletedCount === 1;
  }
}
