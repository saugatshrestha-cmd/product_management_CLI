import { AuditModel } from '@models/auditModel';
import { Audit } from '@mytypes/auditTypes';
import { Request } from 'express';
import { omit } from 'lodash';
import { injectable, inject } from 'tsyringe';
import { AuditRepository } from '@mytypes/repoTypes';
import { AuditRepositoryFactory } from '@factories/auditFactory';

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
  private auditRepository: AuditRepository;
  constructor(
    @inject("AuditRepositoryFactory") private auditRepositoryFactory: AuditRepositoryFactory
  ) {
    this.auditRepository = this.auditRepositoryFactory.getRepository();
  }
  async logAudit(params: AuditLogParams): Promise<void> {
    try {
      const auditData = this.buildAuditData(params);
      await this.auditRepository.add(auditData);
    } catch (error) {
      console.error('Failed to log audit:', error);
    }
  }

  async getAuditLogs(filter: Partial<Audit>, page = 1, limit = 10) {
    return this.auditRepository.getAuditLogs(filter, page, limit);
  }

  async getAuditLogsByUserId(userId: string, page = 1, limit = 10) {
    return this.auditRepository.getAuditLogsByUserId(userId, page, limit);
  }

  async getAuditLogsByEntityId(entityId: string, page = 1, limit = 10) {
    return this.auditRepository.getAuditLogsByEntityId(entityId, page, limit);
  }

  private buildAuditData(params: AuditLogParams): Audit {
    const { req, ...rest } = params;
    const audit: Audit = {
      ...rest,
      timestamp: new Date(),
    };

    if (req) {
      audit.userAgent = req.headers['user-agent'] ?? '';
      audit.request = {
        method: req.method,
        endpoint: req.originalUrl || req.url,
        params: AuditService.sanitizeParams(req.method === 'GET' ? req.query : req.body),
      };
    }

    return audit;
  }

  private static sanitizeParams(params: any): Record<string, unknown> {
    const sensitiveFields = ['password', 'token'];
    return omit(params, sensitiveFields);
  }
}