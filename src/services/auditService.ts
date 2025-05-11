import { AuditModel } from '@models/auditModel';
import { Request } from 'express';
import { omit } from 'lodash';
import { injectable } from 'tsyringe';

interface AuditLogParams {
  action: string;
  entity: string;
  entityId: string;
  userId?: string;
  userRole?: string;
  req?: Request;
  message:string;
  beforeState?: any;
  afterState?: any;
  status: 'success' | 'failed';
}

@injectable()
export class AuditService {
  async logAudit({
    action,
    entity,
    entityId,
    userId,
    userRole,
    req,
    message,
    beforeState,
    afterState,
    status
  }: AuditLogParams): Promise<void> {
    try {
      const auditData: any = {
        action,
        entity,
        entityId,
        userId,
        userRole,
        message,
        status
      };

      if (req) {
        // Capture basic request info
        auditData.ipAddress = req.ip;
        auditData.userAgent = req.headers['user-agent'];
        
        // Capture enhanced request data
        auditData.request = {
          method: req.method,
          endpoint: req.originalUrl,
          // Sanitize sensitive fields from params
          params: AuditService.sanitizeParams(req.method === 'GET' ? req.query : req.body)
        };
      }

      if (beforeState) {
        auditData.beforeState = beforeState;
      }

      if (afterState) {
        auditData.afterState = afterState;
      }

      await AuditModel.create(auditData);
    } catch (error) {
      console.error('Failed to log audit:', error);
      // Don't throw error as we don't want to break main functionality
    }
  }

  private static sanitizeParams(params: any): Record<string, unknown> {
    const sensitiveFields = ['password', 'token'];
    return omit(params, sensitiveFields);
  }
}