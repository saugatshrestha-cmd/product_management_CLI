import { AuditModel} from '@models/auditModel';
import { Audit } from '@mytypes/auditTypes';
import { FilterQuery } from 'mongoose'
import { AuditRepository } from '@mytypes/repoTypes';
import { injectable } from "tsyringe";

@injectable()
export class MongoAuditRepository implements AuditRepository {
  async createAudit(AuditData: Partial<Audit>): Promise<Audit> {
    const newAudit = new AuditModel(AuditData);
    return await newAudit.save();
  }

  async getAudits(filter: FilterQuery<Audit>, page: number = 1, limit: number = 20): Promise<Audit[]> {
    return AuditModel.find(filter)
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  }

  async getAuditsCount(filter: FilterQuery<Audit>): Promise<number> {
    return AuditModel.countDocuments(filter).exec();
  }

  async getEntityHistory(entityType: string, entityId: string, page: number = 1, limit: number = 20): Promise<Audit[]> {
    return this.getAudits({ entityType, entityId }, page, limit);
  }

  async getUserActivityLogs(userId: string, page: number = 1, limit: number = 20): Promise<Audit[]> {
    return this.getAudits({ performedBy: userId }, page, limit);
  }
}