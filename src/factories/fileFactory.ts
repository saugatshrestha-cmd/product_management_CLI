import { injectable } from "tsyringe";
import { FileRepository } from "@mytypes/repoTypes";
import { MongoFileRepository } from "@repository/fileRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class FileRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): FileRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoFileRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}