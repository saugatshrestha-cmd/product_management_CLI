import { UserModel } from '../../models/userModel';
import { User } from '../../types/userTypes';

export class UserRepository {

  private async getNewId(): Promise<number> {
    const lastUser = await UserModel.findOne().sort({ id: -1 });
    return lastUser ? lastUser.id + 1 : 1;
  }

  async getAll(): Promise<User[]> {
    return await UserModel.find();
  }

  async addUser(userData: Omit<User, 'id'>): Promise<void> {
    const newId = await this.getNewId();
    const newUser = new UserModel({ id: newId, ...userData });
    await newUser.save();
  }

  async updateUser(userId: number, updatedInfo: Partial<User>): Promise<void> {
    await UserModel.updateOne({ id: userId }, updatedInfo);
  }

  async deleteUserById(userId: number): Promise<boolean> {
    const result = await UserModel.deleteOne({ id: userId });
    return result.deletedCount === 1;
  }
}
