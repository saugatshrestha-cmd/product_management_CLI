import { injectable, inject } from "tsyringe";
import { UserRepository } from '@repository/userRepo';
import { OrderService } from "./orderService";
import { CartService } from "./cartService";
import { AppError } from "@utils/errorHandler";
import { User } from '@mytypes/userTypes';
import { PasswordManager } from '@utils/passwordUtils';
import { Role } from "@mytypes/enumTypes";
import { RepositoryFactory } from "@repository/baseRepo";

@injectable()
export class UserService {
  private userRepository: UserRepository;
  constructor(
    @inject(RepositoryFactory) private repositoryFactory: RepositoryFactory,
    @inject("PasswordManager") private passwordManager: PasswordManager,
    @inject("OrderService") private orderService: OrderService,
    @inject("CartService") private cartService: CartService
  ) {
    this.userRepository = this.repositoryFactory.getUserRepository();
  }

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User', userId);
    }
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async addUser(user: User): Promise<void> {
    await this.userRepository.add(user);
  }

  async createAdmin(adminData: User): Promise<{ message: string }> {
    const exists = await this.userRepository.findByEmail(adminData.email);
    if (exists) throw AppError.conflict("Email already registered");
  
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(adminData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
  
    const finalUser = { ...adminData, password: combined, role: Role.ADMIN };
    await this.userRepository.add(finalUser);
  
    return { message: "Admin created successfully" };
  }  
  

  async updateUser(userId: string, updatedInfo: User): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User', userId);
    }

    if (updatedInfo.email || updatedInfo.password) {
      throw AppError.badRequest("Email and password cannot be updated here.");
    }

    const { firstName, lastName, phone, address } = updatedInfo;

    const updatedUserInfo = {
      firstName,
      lastName,
      phone,
      address,
    };

    await this.userRepository.update(userId, updatedUserInfo);
    return { message: "User updated successfully" };
  }

  async updateEmail(userId: string, newEmail: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User', userId);
    }

    if (await this.userRepository.findByEmail(newEmail)) {
      throw AppError.conflict("Email already in use");
    }

    await this.userRepository.update(userId, { email: newEmail });
    return { message: "Email updated successfully" };
  }

  async updatePassword(userId: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User', userId);
    }
    const newSalt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(newPassword, newSalt);
    const combined = this.passwordManager.combineSaltAndHash(newSalt, hashed);

    await this.userRepository.update(userId, { password: combined });
    return { message: "Password updated successfully" };
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User', userId);
    }
    // await this.orderService.deleteOrderByUserId(userId);
    await this.cartService.removeCartByUserId(userId);
    await this.userRepository.update(userId, {
      isDeleted: true,
      deletedAt: new Date()
    });
    return { message: "User deleted successfully" };;
  }
}
