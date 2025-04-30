import { Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

interface SuccessResponse<T> {
    success: true;
    message?: string;
    data?: T;
}

interface ErrorResponse {
    success: false;
    statusCode: number;
    message: string;
    errors?: any[];
}

export const sendResponse = <T>(
    res: Response,
    statusCode: number,
    message?: string,
    data?: T
): Response<SuccessResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Keep all error handling functions exactly the same
export const sendError = (
    res: Response,
    error: AppError | Error
): Response<ErrorResponse> => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const message = error.message || 'Internal Server Error';
    
    const response: ErrorResponse = {
        success: false,
        statusCode,
        message,
        errors: error instanceof AppError && error.details 
            ? [error.details] 
            : undefined
    };

    return res.status(statusCode).json(response);
};

export const handleError = (
    next: NextFunction,
    error: unknown
) => {
    return next(error);
};

// New success handler with explicit status codes
export const handleSuccess = <T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode = 200
): Response<SuccessResponse<T>> => {
    return sendResponse(res, statusCode, message, data);
};
