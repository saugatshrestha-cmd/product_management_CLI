import { injectable, inject } from "tsyringe";
import { SellerRepository } from '@repository/sellerRepo';
import { ProductService } from "@services/productService";
import { Seller } from '@mytypes/sellerTypes';
import { AppError } from "@utils/errorHandler";
import { PasswordManager } from '@utils/passwordUtils';
import { Role } from '@mytypes/enumTypes';
import { RepositoryFactory } from "@repository/baseRepo";

@injectable()
export class SellerService {
  private sellerRepository: SellerRepository;
  constructor(
    @inject(RepositoryFactory) private repositoryFactory: RepositoryFactory,
    @inject("PasswordManager") private passwordManager: PasswordManager,
    @inject("ProductService") private productService: ProductService
  ) {
    this.sellerRepository = this.repositoryFactory.getSellerRepository();
  }

  async getSellerById(sellerId: string) {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw AppError.notFound("Seller not found", sellerId);
    }
    return seller;
  }

  async getAllSellers(): Promise<Seller[]> {
    return await this.sellerRepository.getAll();
  }

  async findByEmail(email: string): Promise<Seller | null> {
    return await this.sellerRepository.findByEmail(email);
  }

  async createSeller(sellerData: Seller): Promise<{ message: string }> {
    const exists = await this.sellerRepository.findByEmail(sellerData.email);
    if (exists) throw AppError.conflict("Email already registered");
  
    const salt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(sellerData.password, salt);
    const combined = this.passwordManager.combineSaltAndHash(salt, hashed);
  
    const finalSeller = { ...sellerData, password: combined, role: Role.SELLER };
    await this.sellerRepository.add(finalSeller);
  
    return { message: "Seller created successfully" };
  }  
  

  async updateSeller(sellerId: string, updatedInfo: Seller): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw AppError.notFound("Seller not found", sellerId);
    }

    if (updatedInfo.email || updatedInfo.password) {
      throw AppError.badRequest("Email and password must be updated via dedicated endpoints");
    }

    const { storeName, phone, address } = updatedInfo;

    const updatedSellerInfo = {
      storeName,
      phone,
      address,
    };

    await this.sellerRepository.update(sellerId, updatedSellerInfo);
    return { message: "Seller updated successfully" };
  }

  async updateEmail(sellerId: string, newEmail: string): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw AppError.notFound("Seller not found", sellerId);
    }

    if (await this.sellerRepository.findByEmail(newEmail)) {
      throw AppError.conflict("Email already in use");
    }

    await this.sellerRepository.update(sellerId, { email: newEmail });
    return { message: "Email updated successfully" };
  }

  async updatePassword(sellerId: string, newPassword: string): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw AppError.notFound("Seller not found", sellerId);
    }

    const newSalt = this.passwordManager.createSalt();
    const hashed = this.passwordManager.hashPassword(newPassword, newSalt);
    const combined = this.passwordManager.combineSaltAndHash(newSalt, hashed);

    await this.sellerRepository.update(sellerId, { password: combined });
    return { message: "Password updated successfully" };
  }

  async deleteSeller(sellerId: string): Promise<{ message: string }> {
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller || seller.isDeleted) {
      throw AppError.notFound("Seller not found or already deleted", sellerId);
    }
    await this.productService.deleteProductsBySellerId(sellerId);
    await this.sellerRepository.update(sellerId, {
      isDeleted: true,
      deletedAt: new Date()
    });

    return { message: "Seller and their products deleted successfully" };
  }
}
