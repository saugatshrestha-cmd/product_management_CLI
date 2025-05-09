// middlewares/fileValidation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import mime from 'mime-types';
import { AppError } from '../utils/errorHandler';

export const validateImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const file = req.file;
        const maxSizeMB = 1;
        
        if (!file) {
            return next(new AppError('Image is required'));
        }

        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        const mimeType = mime.lookup(file.originalname);
        
        if (!mimeType || !allowedMimeTypes.includes(mimeType)) {
            return next(new AppError(
                `Only ${allowedMimeTypes.map(t => t.split('/')[1]).join(', ')} images are allowed`, 
            ));
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            return next(new AppError(
                `Image must be less than ${maxSizeMB}MB`, 
            ));
        }

        next();
    } catch (error) {
        next(error);
    }
};