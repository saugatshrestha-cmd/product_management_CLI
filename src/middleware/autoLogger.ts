import { Request, Response, NextFunction } from 'express';
import { logger } from '@utils/logger';

export function autoLogger() {
  return (req: Request, res: Response, next: NextFunction) => {

    // Log the incoming request
    logger.logRequest(req);

    // Capture response body for error logging
    const originalSend = res.send;
    res.send = function(body?: any) {
      if (res.statusCode >= 400) {
        res.locals.responseBody = body;
      }
      return originalSend.call(res, body);
    };

    // Log when response finishes
    res.on('finish', () => {
      logger.logResponse(req, res);
    });

    next();
  };
}