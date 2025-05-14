import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'tsyringe';
import { AuditService } from '@services/auditService'; 
import { handleSuccess, handleError } from '@utils/apiResponse';
import { logger } from '@utils/logger';
import { Audit } from '@mytypes/auditTypes';

@injectable()
export class AuditController {
  constructor(
    @inject("AuditService") private auditService: AuditService 
  ) {}

  async getAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const { page: _p, limit: _l, ...rawFilter } = req.query;

      const filter = rawFilter as unknown as Partial<Audit>;

      const { logs, total } = await this.auditService.getAuditLogs(filter, page, limit);

      logger.info(`[${req.method}] ${req.originalUrl} - Audit logs fetched successfully`, {
        page,
        limit,
        totalResults: total,
      });

      handleSuccess(res, {
        message: 'Audit logs fetched successfully',
        data: logs,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('Failed to fetch audit logs', { error });
      handleError(next, error);
    }
  }

  async getAuditLogsByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      const { logs, total } = await this.auditService.getAuditLogsByUserId(id, page, limit);

      logger.info(`[${req.method}] ${req.originalUrl} - Audit logs by user ID fetched successfully`, {
        userId: id,
        page,
        limit,
        totalResults: total,
      });

      handleSuccess(res, {
        message: 'Audit logs by user ID fetched successfully',
        data: logs,
        meta: {
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('Failed to fetch audit logs by user ID', { error });
      handleError(next, error);
    }
  }

  async getAuditLogsByEntityId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);

      const { logs, total } = await this.auditService.getAuditLogsByEntityId(id, page, limit);

      logger.info(`[${req.method}] ${req.originalUrl} - Audit logs by entity ID fetched successfully`, {
        entityId: id,
        page,
        limit,
        totalResults: total,
      });

      handleSuccess(res, {
        message: 'Audit logs by entity ID fetched successfully',
        data: logs,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      logger.error('Failed to fetch audit logs by entity ID', { error });
      handleError(next, error);
    }
  }
}
