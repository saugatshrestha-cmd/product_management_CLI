import { Request, Response, NextFunction } from 'express';
import { UserService } from '@services/userService';
import { AuthRequest } from '@mytypes/authTypes';
import { handleError, handleSuccess } from '@utils/apiResponse';
import { injectable, inject } from "tsyringe";


@injectable()
export class UserController {
    constructor(
        @inject("UserService") private userService: UserService
    ) {}

    async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const user = await this.userService.getUserById(userId);
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

    async deleteUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const deleted = await this.userService.deleteUser(userId);
            handleSuccess(res, deleted);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            handleSuccess(res, users);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.getUserById(userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const updatedInfo = req.body;
            const result = await this.userService.updateUser(userId, updatedInfo);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.updateEmail(userId, req.body.email);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.updatePassword(userId, req.body.password);
            handleSuccess(res, result);;
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminDeleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const deleted = await this.userService.deleteUser(req.params.id);
            handleSuccess(res, deleted);
        } catch(error) {
            handleError(next, error);
        }
    }
}