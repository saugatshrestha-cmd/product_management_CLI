import { injectable } from "tsyringe";
import { UserRepository } from "@mytypes/repoTypes";
import { MongoUserRepository } from "@repository/userRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class UserRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): UserRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoUserRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}