import { Request, Response, NextFunction } from 'express';
import { UserService } from '@services/userService';
import { AuthRequest } from '@mytypes/authTypes';
import { handleError, handleSuccess } from '@utils/apiResponse';
import { injectable, inject } from "tsyringe";
import { logger } from '@utils/logger';

@injectable()
export class UserController {
    constructor(
        @inject("UserService") private userService: UserService
    ) {}

    async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const user = await this.userService.getUserById(userId);
            logger.info(`[${req.method}] ${req.originalUrl} - User profile fetched successfully`, { userId });
            handleSuccess(res, user);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const updatedInfo = req.body;
            const result = await this.userService.updateUser(userId, updatedInfo, req);
            logger.info(`[${req.method}] ${req.originalUrl} - User profile updated successfully`, { userId, updatedInfo });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateEmail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const result = await this.userService.updateEmail(userId, req.body.email, req);
            logger.info(`[${req.method}] ${req.originalUrl} - User email updated successfully`, { email: req.body.email });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const result = await this.userService.updatePassword(userId, req.body.password, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Password updated successfully`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const deleted = await this.userService.deleteUser(userId);
            logger.info(`[${req.method}] ${req.originalUrl} - User deleted successfully`, { userId });
            handleSuccess(res, deleted);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            logger.info(`[${req.method}] ${req.originalUrl} - All users fetched successfully`);
            handleSuccess(res, users);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.getUserById(userId);
            logger.info(`[${req.method}] ${req.originalUrl} - User fetched successfully`, { userId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const updatedInfo = req.body;
            const result = await this.userService.updateUser(userId, updatedInfo, req);
            logger.info(`[${req.method}] ${req.originalUrl} - User profile updated successfully`, { userId, updatedInfo });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.updateEmail(userId, req.body.email, req);
            logger.info(`[${req.method}] ${req.originalUrl} - User email updated successfully`, { email: req.body.email });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.updatePassword(userId, req.body.password, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Password updated successfully`);
            handleSuccess(res, result);;
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleted = await this.userService.deleteUser(req.params.id, req);
            logger.info(`[${req.method}] ${req.originalUrl} - User deleted successfully`);
            handleSuccess(res, deleted);
        } catch(error) {
            handleError(next, error);
        }
    }
}