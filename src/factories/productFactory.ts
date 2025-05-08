import { injectable } from "tsyringe";
import { ProductRepository } from "@mytypes/repoTypes";
import { MongoProductRepository } from "@repository/productRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class ProductRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): ProductRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoProductRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}