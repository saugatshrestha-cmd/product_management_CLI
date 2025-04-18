import { CartModel } from '../../models/cartModel';
import { Cart, CartItem } from '../../types/cartTypes';

export class CartRepository {

  private async getNewId(): Promise<number> {
    const lastCart = await CartModel.findOne().sort({ id: -1 });
    return lastCart ? lastCart.id + 1 : 1;
  }

  async getAll(): Promise<Cart[]> {
    return await CartModel.find();
  }

  async findCartByUserId(userId: number): Promise<Cart | null> {
    return await CartModel.findOne({ userId });
  }

  async addCart(cartData: Omit<Cart, 'id'>): Promise<Cart> {
    const newId = await this.getNewId();
    const newCart = new CartModel({ id: newId, ...cartData });
    return await newCart.save();
  }

  async updateCart(userId: number, updatedItems: CartItem[]): Promise<Cart | null> {
    const updatedCart = await CartModel.findOneAndUpdate(
      { userId },
      { $set: { items: updatedItems } },
      { new: true }
    );
    return updatedCart;
  }

  async removeCartByUserId(userId: number): Promise<boolean> {
    const result = await CartModel.deleteOne({ userId });
    return result.deletedCount === 1;
  }
}
