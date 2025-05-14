import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@services/productService';
import { handleSuccess, handleError } from '@utils/apiResponse';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { logger } from '@utils/logger';
import { AppError } from '@utils/errorHandler';

@injectable()
export class ProductController {
    constructor(
                @inject("ProductService") private productService: ProductService
            ) {}

    async createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedInUser = req.user?._id as string;
            const files = req.files as Express.Multer.File[];
            const productData = req.body;
            productData.sellerId = loggedInUser;
            if (!files || files.length === 0) {
            throw AppError.badRequest('At least one image is required');  // Custom error if no files are uploaded
        }           
            const result = await this.productService.createProduct(productData, files, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Product added successfully`);
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async getProductBySeller(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const products = await this.productService.getProductsBySeller(sellerId);
            logger.info(`[${req.method}] ${req.originalUrl} - Products fetched successfully`);
            handleSuccess(res, products);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const productId = req.params.id;
            const filesToDelete = Array.isArray(req.body.filesToDelete) 
                ? req.body.filesToDelete 
                : req.body.filesToDelete 
                ? [req.body.filesToDelete] 
                : [];
            const updatedInfo = req.body;
            const result = await this.productService.updateProduct(productId, req.body, req.files as Express.Multer.File[],filesToDelete, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Product updated successfully`, { productId, updatedInfo});
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Product deleted successfully`, { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.productService.getAllProducts();
            logger.info(`[${req.method}] ${req.originalUrl} - All products fetched successfully`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.getProductById(productId);
            logger.info(`[${req.method}] ${req.originalUrl} - Product fetched successfully`, { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminUpdateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const updatedInfo = req.body;
            const result = await this.productService.updateProduct(productId, updatedInfo);
            logger.info(`[${req.method}] ${req.originalUrl} - Product updated successfully`, { productId, updatedInfo });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminDeleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Product deleted successfully`, { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}

