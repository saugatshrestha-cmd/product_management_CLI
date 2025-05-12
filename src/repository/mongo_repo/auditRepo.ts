import { AuditModel } from '@models/auditModel';
import { Audit } from '@mytypes/auditTypes';
import { AuditRepository } from '@mytypes/repoTypes';

export class MongoAuditRepository implements AuditRepository {
  async add(audit: Audit): Promise<void> {
    await AuditModel.create(audit);
  }
  
  async getAuditLogs(
    filter: Partial<Audit>,
    page: number = 1,
    limit: number = 10
  ): Promise<{ logs: Audit[]; total: number }> {
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      AuditModel.find(filter)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AuditModel.countDocuments(filter)
    ]);

    return { logs, total };
  }

  async getAuditLogsByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ logs: Audit[]; total: number }> {
    return this.getAuditLogs({ userId }, page, limit);
  }

  async getAuditLogsByEntityId(
    entityId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ logs: Audit[]; total: number }> {
    return this.getAuditLogs({ entityId }, page, limit);
  }
}