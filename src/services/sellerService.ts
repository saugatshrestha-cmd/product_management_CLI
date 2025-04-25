import { injectable, inject } from "tsyringe";
import { SellerRepository } from '@repository/sellerRepo';
import { Seller } from '@mytypes/sellerTypes';
import { PasswordManager } from '@utils/passwordUtils';
import { Role } from '@mytypes/enumTypes';

@injectable()
export class SellerService {

  constructor(
    @inject("SellerRepository") private sellerRepository: SellerRepository,
    @inject("PasswordManager") private passwordManager: PasswordManager
  ) {}

  async getSellerById(sellerId: string) {
    const seller = await this.sellerRepository.findById(sellerId);
    return seller || { message: "Seller not found" };
  }

  async getAllSellers(): Promise<Seller[]> {
    return await this.sellerRepository.getAll();
  }

  async findByEmail(email: string): Promise<Seller | null> {
    return await this.sellerRepository.findByEmail(email);
  }

  async createSeller(sellerData: Seller): Promise<{ message: string }> {
    const exists = await this.sellerRepository.findByEmail(sellerData.email);
    if (exists) return { message: "Email already registered" };
  
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(sellerData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
  
    const finalSeller = { ...sellerData, password: combined, role: Role.SELLER };
    await this.sellerRepository.addSeller(finalSeller);
  
    return { message: "Seller created successfully" };
  }  
  

  async updateSeller(sellerId: string, updatedInfo: Seller): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      return { message: "Seller not found" };
    }

    if (updatedInfo.email || updatedInfo.password) {
      return { message: "Email and password cannot be updated." };
    }

    const { storeName, phone, address } = updatedInfo;

    const updatedSellerInfo = {
      storeName,
      phone,
      address,
    };

    await this.sellerRepository.updateSeller(sellerId, updatedSellerInfo);
    return { message: "Seller updated successfully" };
  }

  async updateEmail(sellerId: string, newEmail: string): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      return { message: "Seller not found" };
    }

    if (await this.sellerRepository.findByEmail(newEmail)) {
      return { message: "Email already in use" };
    }

    await this.sellerRepository.updateSeller(sellerId, { ...seller, email: newEmail });
    return { message: "Email updated successfully" };
  }

  async updatePassword(sellerId: string, newPassword: string): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      return { message: "Seller not found" };
    }

    const newSalt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(newPassword, newSalt);
    const combined = this.passwordManager.combineSaltAndHash(newSalt, hashed);

    await this.sellerRepository.updateSeller(sellerId, { ...seller, password: combined });
    return { message: "Password updated successfully" };
  }

  async deleteSeller(sellerId: string): Promise<{ message: string }> {
    const success = await this.sellerRepository.deleteSellerById(sellerId);
    return { message: success ? "Seller deleted successfully" : "Seller not found" };
  }
}
