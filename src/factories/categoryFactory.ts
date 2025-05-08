import { injectable } from "tsyringe";
import { CategoryRepository } from "@mytypes/repoTypes";
import { MongoCategoryRepository } from "@repository/categoryRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class CategoryRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): CategoryRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoCategoryRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}