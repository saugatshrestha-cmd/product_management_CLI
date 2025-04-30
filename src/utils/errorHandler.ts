
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;
    public errorType: string;
    public details?: any;

    constructor(message: string,
        options: {
            statusCode?: number;
            errorType?: string;
            isOperational?: boolean;
            details?: any;
        } = {}) {
            super(message);
            this.statusCode = options.statusCode || 500;
            this.isOperational = options.isOperational ?? true;
            this.errorType = options.errorType || 'OperationalError';
            this.details = options.details;
    }

    static badRequest(message: string, details?: any) {
        return new AppError(message, {
            statusCode: 400,
            errorType: 'BadRequest',
            details
        });
    }

    static unauthorized(message = 'Unauthorized') {
        return new AppError(message, {
            statusCode: 401,
            errorType: 'Unauthorized'
        });
    }

    static forbidden(message = 'Forbidden') {
        return new AppError(message, {
            statusCode: 403,
            errorType: 'Forbidden'
        });
    }

    static notFound(resource: string, id?: string) {
        return new AppError(
            `${resource}${id ? ` with ID ${id}` : ''} not found`,
            {
                statusCode: 404,
                errorType: 'NotFound'
            }
        );
    }

    static conflict(message = 'Conflict') {
        return new AppError(message, {
            statusCode: 409,
            errorType: 'Conflict'
        });
    }

    static internal(message = 'Internal Server Error') {
        return new AppError(message, {
            statusCode: 500,
            errorType: 'InternalError',
            isOperational: false
        });
    }
}


