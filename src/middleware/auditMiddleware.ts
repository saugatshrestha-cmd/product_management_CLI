// src/middleware/AuditMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/auditService';
import { AuthRequest } from '../types/authTypes';
import { injectable, inject } from 'tsyringe';

@injectable()
export class AuditMiddleware {
  constructor(
    @inject("AuditService") private readonly auditService: AuditService
  ) {}

  public handle(action: string, entity: string) {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      const originalSend = res.send;
      let responseBody: any;

      // Override res.send to capture response body
      res.send = (body?: any): any => {
        responseBody = body;
        return originalSend.call(res, body);
      };

      // Log after response finishes
      res.on('finish', async () => {
        await this.logAuditData(req, res, action, entity, responseBody);
      });

      next();
    };
  }

  private async logAuditData(
    req: AuthRequest,
    res: Response,
    action: string,
    entity: string,
    responseBody: any
  ): Promise<void> {
    try {
      const status = this.determineStatus(res.statusCode);
      const entityId = this.extractEntityId(req, responseBody);

      if (entityId) {
        await this.auditService.logAudit({
          action,
          entity,
          entityId,
          userId: req.user?._id,
          userRole: req.user?.role,
          req,
          status
        });
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  private determineStatus(statusCode: number): 'success' | 'failed' {
    return statusCode >= 200 && statusCode < 300 ? 'success' : 'failed';
  }

  private extractEntityId(req: AuthRequest, responseBody: any): string | undefined {
    return req.params.id || responseBody?._id || responseBody?.id;
  }

  private handleError(error: unknown): void {
    console.error('Audit logging failed:', error);
    // Consider injecting a logger service here
  }
}