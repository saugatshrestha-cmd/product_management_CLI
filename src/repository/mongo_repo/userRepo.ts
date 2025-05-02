import { injectable } from "tsyringe";
import { UserModel } from '@models/userModel';
import { User } from '@mytypes/userTypes';

@injectable()
export class UserRepository {

  async getAll(): Promise<User[]> {
    return await UserModel.find({ role: { $ne: 'admin' } }).select('-password');
  }

  async findById(userId: string): Promise<User | null> {
    return await UserModel.findOne({ _id: userId, isDeleted: false }).select('-password -isDeleted -deletedAt');
  }

  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email, isDeleted: false });
  }

  async addUser(userData: User): Promise<void> {
    const newUser = new UserModel(userData);
    await newUser.save();
  }

  async updateUser(userId: string, updatedInfo: Partial<User>): Promise<void> {
    await UserModel.updateOne({ _id: userId }, updatedInfo);
  }

}
