import { AuditRepositoryFactory } from '@factories/auditFactory';
import { injectable, inject } from "tsyringe";
import { FilterQuery } from 'mongoose';
import { Audit } from '@mytypes/auditTypes';
import { AuditRepository } from '@mytypes/repoTypes';
import { AuthRequest } from '@mytypes/authTypes';
import { Request } from 'express';

@injectable()
export class AuditService {
  private auditRepository: AuditRepository;
  constructor(
    @inject("AuditRepositoryFactory") private auditRepositoryFactory: AuditRepositoryFactory
  ) {
    this.auditRepository = this.auditRepositoryFactory.getRepository();
  }

  async logActivity(
    req: AuthRequest, 
    entityType: string, 
    entityId: string, 
    action: string, 
    previousState?: any, 
    newState?: any, 
    details?: any
  ): Promise<void> {
    try {
      const user = req.user as any; // Cast to any to access userRole and _id
      
      const affectedFields = previousState && newState 
        ? this.getChangedFields(previousState, newState)
        : undefined;

      const auditData: Partial<Audit> = {
        entityType,
        entityId,
        action,
        performedBy: user?._id || 'system',
        userRole: user?.role || 'system',
        ipAddress: this.getClientIp(req),
        userAgent: req.headers['user-agent'] || '',
        previousState,
        newState,
        details,
        affectedFields
      };

      // Use non-blocking approach to avoid impacting application performance
      this.auditRepository.createAudit(auditData).catch(err => {
        console.error('Failed to create audit log:', err);
      });
    } catch (error) {
      // Log the error but don't throw it to prevent affecting the main application flow
      console.error('Error in audit logging:', error);
    }
  }

  async getEntityHistory(entityType: string, entityId: string, page: number = 1, limit: number = 20): Promise<Audit[]> {
    return this.auditRepository.getEntityHistory(entityType, entityId, page, limit);
  }

  async getUserActivityLogs(userId: string, page: number = 1, limit: number = 20): Promise<Audit[]> {
    return this.auditRepository.getUserActivityLogs(userId, page, limit);
  }

  async searchAuditLogs(filter: FilterQuery<Audit>, page: number = 1, limit: number = 20): Promise<{logs: Audit[], total: number, pages: number}> {
    const [logs, total] = await Promise.all([
      this.auditRepository.getAudits(filter, page, limit),
      this.auditRepository.getAuditsCount(filter)
    ]);
    
    return {
      logs,
      total,
      pages: Math.ceil(total / limit)
    };
  }

  private getClientIp(req: Request): string {
    return req.ip || 
           (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || 
           req.socket.remoteAddress || 
           '';
  }

  private getChangedFields(oldObj: any, newObj: any): string[] {
    const changedFields: string[] = [];
    
    // Compare the two objects and identify changed fields
    Object.keys(newObj).forEach(key => {
      // Skip comparing mongoose/mongo specific fields
      if (key === '_id' || key === '__v' || key === 'updatedAt' || key === 'createdAt') {
        return;
      }
      
      // Check if the field exists in both objects and has changed
      if (oldObj.hasOwnProperty(key) && JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
        changedFields.push(key);
      }
      // Check if the field is new
      else if (!oldObj.hasOwnProperty(key)) {
        changedFields.push(key);
      }
    });
    
    // Check for deleted fields
    Object.keys(oldObj).forEach(key => {
      if (key === '_id' || key === '__v' || key === 'updatedAt' || key === 'createdAt') {
        return;
      }
      
      if (!newObj.hasOwnProperty(key)) {
        changedFields.push(`${key} (removed)`);
      }
    });
    
    return changedFields;
  }
}