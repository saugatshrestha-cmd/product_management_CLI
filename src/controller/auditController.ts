import { Request, Response, NextFunction } from 'express';
import { AuditService } from '@services/auditService';
import { inject, injectable } from 'tsyringe';
import { handleSuccess, handleError } from '@utils/apiResponse';

@injectable()
export class AuditController {
    constructor(
                @inject("AuditService") private auditService: AuditService
            ) {}

  async getEntityHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { entityType, entityId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const logs = await this.auditService.getEntityHistory(entityType, entityId, page, limit);
      
      return handleSuccess(res, logs);
    } catch (error) {
      console.error('Error retrieving entity history:', error);
      return handleError(next, error);
    }
  }
  
  async getUserActivity(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const logs = await this.auditService.getUserActivityLogs(userId, page, limit);
      
      return handleSuccess(res, logs);
    } catch (error) {
      console.error('Error retrieving user activity logs:', error);
      return handleError(next, error);
    }
  }
  
  async searchAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { entityType, action, userId, startDate, endDate } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const filter: any = {};
      
      if (entityType) filter.entityType = entityType;
      if (action) filter.action = action;
      if (userId) filter.performedBy = userId;
      
      if (startDate || endDate) {
        filter.timestamp = {};
        if (startDate) filter.timestamp.$gte = new Date(startDate as string);
        if (endDate) filter.timestamp.$lte = new Date(endDate as string);
      }
      
      const result = await this.auditService.searchAuditLogs(filter, page, limit);
      
      return handleSuccess(res, result);
    } catch (error) {
      console.error('Error searching audit logs:', error);
      return handleError(next, error);
    }
  }
}