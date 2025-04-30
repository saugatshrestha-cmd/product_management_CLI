import { Request, Response, NextFunction } from 'express';
import { SellerService } from '@services/sellerService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';

@injectable()
export class SellerController {
    constructor(
            @inject("SellerService") private sellerService: SellerService
        ) {}

    async createSeller(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{
            const newSeller = req.body;
            const result = await this.sellerService.createSeller(newSeller);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const result = await this.sellerService.getSellerById(sellerId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const updatedInfo = req.body;
            const result = await this.sellerService.updateSeller(sellerId, updatedInfo);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateEmail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const result = await this.sellerService.updateEmail(sellerId, req.body.email);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);;
        }
    }

    async updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const result = await this.sellerService.updatePassword(sellerId, req.body.password);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllSellers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.sellerService.getAllSellers();
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getSellerById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.getSellerById(sellerId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateSeller(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const updatedSellerInfo = req.body;
            const result = await this.sellerService.updateSeller(sellerId, updatedSellerInfo);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.updateEmail(sellerId, req.body.email);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.updatePassword(sellerId, req.body.password);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async deleteSeller(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.deleteSeller(sellerId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}
