import { Request, Response, NextFunction } from 'express';
import { AuditService } from '@services/auditService';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuditMiddleware {
  constructor(
                @inject("AuditService") private auditService: AuditService
            ) {}

  createMiddleware(
    entityType: string,
    actionGetter: (req: Request) => string,
    entityIdGetter: (req: Request) => string,
    detailsGetter?: (req: Request, res: Response) => any
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const originalEnd = res.end;

      res.end = function (
        this: Response,
        chunk?: any,
        encoding?: BufferEncoding | (() => void),
        cb?: () => void
      ): Response {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const action = actionGetter(req);
            const entityId = entityIdGetter(req);
            const details = detailsGetter ? detailsGetter(req, res) : undefined;

            // Log the audit
            (async () => {
              try {
                await AuditMiddleware.prototype.auditService.logActivity(
                  req,
                  entityType,
                  entityId,
                  action,
                  req.body.originalData,
                  req.body,
                  details
                );
              } catch (err) {
                console.error('Audit logging failed:', err);
              }
            })();
          }
        } catch (err) {
          console.error('Error in audit middleware:', err);
        }

        return originalEnd.call(this, chunk, encoding as BufferEncoding, cb);
      };

      next();
    };
  }
}
