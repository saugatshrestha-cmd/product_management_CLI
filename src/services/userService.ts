import { injectable, inject } from "tsyringe";
import { UserRepository } from '@repository/userRepo';
import { User } from '@mytypes/userTypes';
import { PasswordManager } from '@utils/passwordUtils';
import { Role } from "@mytypes/enumTypes";

@injectable()
export class UserService {
  constructor(
    @inject("UserRepository") private userRepository: UserRepository,
    @inject("PasswordManager") private passwordManager: PasswordManager
  ) {}

  async getUserById(userId: string) {
    const user = await this.userRepository.findById(userId);
    return user || { message: "User not found" };
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAll();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findByEmail(email);
  }

  async addUser(user: User): Promise<void> {
    await this.userRepository.addUser(user);
  }

  async createAdmin(adminData: User): Promise<{ message: string }> {
    const exists = await this.userRepository.findByEmail(adminData.email);
    if (exists) return { message: "Email already registered" };
  
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(adminData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
  
    const finalUser = { ...adminData, password: combined, role: Role.ADMIN };
    await this.userRepository.addUser(finalUser);
  
    return { message: "Admin created successfully" };
  }  
  

  async updateUser(userId: string, updatedInfo: User): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { message: "User not found" };
    }

    if (updatedInfo.email || updatedInfo.password) {
      return { message: "Email and password cannot be updated." };
    }

    const { firstName, lastName, phone, address } = updatedInfo;

    const updatedUserInfo = {
      firstName,
      lastName,
      phone,
      address,
    };

    await this.userRepository.updateUser(userId, updatedUserInfo);
    return { message: "User updated successfully" };
  }

  async updateEmail(userId: string, newEmail: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { message: "User not found" };
    }

    if (await this.userRepository.findByEmail(newEmail)) {
      return { message: "Email already in use" };
    }

    await this.userRepository.updateUser(userId, { ...user, email: newEmail });
    return { message: "Email updated successfully" };
  }

  async updatePassword(userId: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      return { message: "User not found" };
    }

    const newSalt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(newPassword, newSalt);
    const combined = this.passwordManager.combineSaltAndHash(newSalt, hashed);

    await this.userRepository.updateUser(userId, { ...user, password: combined });
    return { message: "Password updated successfully" };
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    const success = await this.userRepository.deleteUserById(userId);
    return { message: success ? "User deleted successfully" : "User not found" };
  }
}
