import { UserRepository } from '../repository/mongo_repo/userRepo';
import { User } from '../types/userTypes';
import { PasswordManager } from '../utils/passwordUtils';

export class UserService {
  private userRepository: UserRepository;
  private passwordManager: PasswordManager;

  constructor() {
    this.userRepository = new UserRepository();
    this.passwordManager = new PasswordManager();
  }

  private async isEmailRegistered(email: string): Promise<boolean> {
    const users = await this.userRepository.getAll();
    return users.some(user => user.email === email);
  }

  private async findUserById(userId: number): Promise<User | undefined> {
    const users = await this.userRepository.getAll();
    return users.find(user => user.id === userId);
  }

  async getUserById(userId: number) {
    const user = await this.findUserById(userId);
    return user || { message: "User not found" };
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async createAdmin(adminData: Omit<User, 'id'>): Promise<{ message: string }> {
    const exists = await this.isEmailRegistered(adminData.email);
    if (exists) return { message: "Email already registered" };
  
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(adminData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
  
    const finalUser = { ...adminData, password: combined };
    await this.userRepository.addUser(finalUser);
  
    return { message: "Admin created successfully" };
  }  
  

  async updateUser(userId: number, updatedInfo: User): Promise<{ message: string }> {
    const user = await this.findUserById(userId);
    if (!user) {
      return { message: "User not found" };
    }

    if (user.email !== updatedInfo.email && await this.isEmailRegistered(updatedInfo.email)) {
      return { message: "Email already in use" };
    }

    await this.userRepository.updateUser(userId, updatedInfo);
    return { message: "User updated successfully" };
  }

  async updateEmail(userId: number, newEmail: string): Promise<{ message: string }> {
    const user = await this.findUserById(userId);
    if (!user) {
      return { message: "User not found" };
    }

    if (await this.isEmailRegistered(newEmail)) {
      return { message: "Email already in use" };
    }

    await this.userRepository.updateUser(userId, { ...user, email: newEmail });
    return { message: "Email updated successfully" };
  }

  async updatePassword(userId: number, newPassword: string): Promise<{ message: string }> {
    const user = await this.findUserById(userId);
    if (!user) {
      return { message: "User not found" };
    }

    const newSalt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(newPassword, newSalt);
    const combined = this.passwordManager.combineSaltAndHash(newSalt, hashed);

    await this.userRepository.updateUser(userId, { ...user, password: combined });
    return { message: "Password updated successfully" };
  }

  async deleteUser(userId: number): Promise<{ message: string }> {
    const success = await this.userRepository.deleteUserById(userId);
    return { message: success ? "User deleted successfully" : "User not found" };
  }
}
