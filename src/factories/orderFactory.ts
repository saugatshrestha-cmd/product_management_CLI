import { injectable } from "tsyringe";
import { OrderRepository } from "@mytypes/repoTypes";
import { MongoOrderRepository } from "@repository/orderRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class OrderRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): OrderRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoOrderRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}