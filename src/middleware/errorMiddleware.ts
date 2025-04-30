import { Request, Response, NextFunction} from 'express';
import { AppError } from '@utils/errorHandler';
import { sendError } from '@utils/apiResponse';

export const errorMiddleware = (
    err: AppError | Error, 
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    if (err instanceof AppError) {
        sendError(res, err);
        return;
    }

    sendError(res, AppError.internal(err.message))
};