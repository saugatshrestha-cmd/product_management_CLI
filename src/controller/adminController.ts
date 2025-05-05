import { Request, Response, NextFunction } from 'express';
import { UserService } from '@services/userService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';
import { logger } from '@utils/logger';

@injectable()
export class AdminController {
    constructor(
                @inject("UserService") private userService: UserService
            ) {}
    async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{
            const newAdmin = req.body;
            const result = await this.userService.createAdmin(newAdmin);
            logger.info('Admin registered successfully');
            handleSuccess(res, result);
        } catch(error: any) {
            logger.error('Registration error', {
                error: error.message,
                email: req.body.email,
            });
            handleError(next, error);
        }
    }

    async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const user = await this.userService.getUserById(userId);
            logger.info('Admin registered successfully');
            handleSuccess(res, user);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const updatedInfo = req.body;
            const result = await this.userService.updateUser(userId, updatedInfo);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateEmail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const result = await this.userService.updateEmail(userId, req.body.email);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const result = await this.userService.updatePassword(userId, req.body.password);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async deleteAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.deleteUser(userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}