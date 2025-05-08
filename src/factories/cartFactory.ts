import { injectable } from "tsyringe";
import { CartRepository } from "@mytypes/repoTypes";
import { MongoCartRepository } from "@repository/cartRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class CartRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): CartRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoCartRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}