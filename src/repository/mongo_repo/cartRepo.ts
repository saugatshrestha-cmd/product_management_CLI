import { CartModel } from '../../models/cartModel';
import { Cart, CartItem, CartInput } from '../../types/cartTypes';

export class CartRepository {

  async getAll(): Promise<Cart[]> {
    return await CartModel.find();
  }

  async findCartByUserId(userId: string): Promise<Cart | null> {
    return await CartModel.findOne({ userId });
  }

  async addCart(cartData: CartInput): Promise<void> {
    const newCart = new CartModel(cartData);
    await newCart.save();
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
