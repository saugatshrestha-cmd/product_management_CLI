import { Request, Response, NextFunction} from 'express';
import { AppError } from '@utils/errorHandler';
import { sendError } from '@utils/apiResponse';
import { logger } from '@utils/logger';

export const errorMiddleware = (
    err: AppError | Error, 
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        // Log operational errors
        logger.error(`[${err.errorType}] ${err.message}`, {
            statusCode: err.statusCode,
            errorType: err.errorType,
            email: req.body?.email || req.params?.id,
            method: req.method,
            url: req.originalUrl,
        });
    } else {
        // Log unexpected errors
        logger.error('Unexpected error', {
            message: err.message,
            stack: err.stack,
            email: req.body?.email || req.params?.id,
            method: req.method,
            url: req.originalUrl,
        });
    }
    if (err instanceof AppError) {
        sendError(res, err);
        return;
    }else{
    sendError(res, AppError.internal(err.message));
    }
};