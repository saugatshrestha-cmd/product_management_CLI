// src/controllers/auditController.ts
import { Request, Response, NextFunction } from 'express';
import { AuditRepo } from '@repository/auditRepo';
import { AuditFilter } from '@mytypes/auditTypes';
import { handleSuccess, handleError } from '@utils/apiResponse';
import { injectable, inject } from 'tsyringe';
import { logger } from '@utils/logger';

@injectable()
export class AuditController {
  constructor(
    @inject("AuditRepo") private auditRepo: AuditRepo
  ) {}

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { page = 1, limit = 10, ...filter } = req.query;
      
      const { logs, total } = await this.auditRepo.getAuditLogs(
        filter as AuditFilter,
        parseInt(page as string),
        parseInt(limit as string)
      );

      logger.info('Audit logs fetched successfully', {
        page,
        limit,
        totalResults: total
      });

      handleSuccess(res, {
        message: 'Audit logs fetched successfully',
        data: logs,
        meta: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          totalPages: Math.ceil(total / parseInt(limit as string))
        }
      });
    } catch (error) {
      logger.error('Failed to fetch audit logs', { error });
      handleError(next, error);
    }
  }
}