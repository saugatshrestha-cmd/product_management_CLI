import { Request, Response, NextFunction } from 'express';
import { SellerService } from '@services/sellerService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';
import { logger } from '@utils/logger';

@injectable()
export class SellerController {
    constructor(
            @inject("SellerService") private sellerService: SellerService
        ) {}

    async createSeller(req: Request, res: Response, next: NextFunction): Promise<void>{
        try{
            const newSeller = req.body;
            const result = await this.sellerService.createSeller(newSeller);
            logger.info('Seller registered successfully');
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const result = await this.sellerService.getSellerById(sellerId);
            logger.info('Seller profile fetched successfully', { sellerId });
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
            logger.info('Seller profile updated successfully', { sellerId, updatedInfo });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateEmail(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const result = await this.sellerService.updateEmail(sellerId, req.body.email);
            logger.info('Seller email successfully', { email: req.body.email });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);;
        }
    }

    async updatePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const result = await this.sellerService.updatePassword(sellerId, req.body.password);
            logger.info('Password updated successfully');
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async deleteSeller(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const result = await this.sellerService.deleteSeller(sellerId);
            logger.info('Seller deleted successfully', { sellerId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllSellers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.sellerService.getAllSellers();
            logger.info('Sellers fetched successfully');
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getSellerById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.getSellerById(sellerId);
            logger.info('Seller fetched successfully', { sellerId });
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
            logger.info('Seller profile updated successfully', { sellerId, updatedSellerInfo });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.updateEmail(sellerId, req.body.email);
            logger.info('Seller email successfully', { email: req.body.email });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdatePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.updatePassword(sellerId, req.body.password);
            logger.info('Password updated successfully');
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminDeleteSeller(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.deleteSeller(sellerId);
            logger.info('Seller deleted successfully', { sellerId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}
