import { injectable } from "tsyringe";
import { AuditRepository } from "@mytypes/repoTypes";
import { MongoAuditRepository } from "@repository/auditRepo";
import { AppError } from "@utils/errorHandler";

@injectable()
export class AuditRepositoryFactory {
    private storageType: string;
    constructor() {
        this.storageType = process.env.STORAGE_TYPE || "MONGO";
    }
    getRepository(): AuditRepository {
        switch (this.storageType) {
            case "MONGO":
                return new MongoAuditRepository();
            default:
                throw new AppError(`Unsupported storage type: ${this.storageType}`);
        }
    }
}