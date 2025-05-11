import { AuditModel } from '@models/auditModel';
import { Audit } from '@mytypes/auditTypes';

export class AuditRepo {
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
}