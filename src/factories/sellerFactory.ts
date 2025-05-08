import { injectable } from "tsyringe";
import { SellerRepository } from "@mytypes/repoTypes";
import { MongoSellerRepository } from "@repository/sellerRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class SellerRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): SellerRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoSellerRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}