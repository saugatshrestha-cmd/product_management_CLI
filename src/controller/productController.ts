import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@services/productService';
import { handleSuccess, handleError } from '@utils/apiResponse';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { logger } from '@utils/logger';

@injectable()
export class ProductController {
    constructor(
                @inject("ProductService") private productService: ProductService
            ) {}

    async createProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const loggedInUser = req.user?._id as string;
            const productData = req.body;
            productData.sellerId = loggedInUser;
            const result = await this.productService.createProduct(productData);
            logger.info('Product added successfully');
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async getProductBySeller(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const products = await this.productService.getProductsBySeller(sellerId);
            logger.info('Products fetched successfully');
            handleSuccess(res, products);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const productId = req.params.id;
            const updatedInfo = req.body
            const result = await this.productService.updateProduct(productId, updatedInfo);
            logger.info('Product updated successfully', { productId, updatedInfo });
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async deleteProduct(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId);
            logger.info('Product deleted successfully', { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.productService.getAllProducts();
            logger.info('All products fetched successfully');
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.getProductById(productId);
            logger.info('Product fetched successfully', { productId });
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
            logger.info('Product updated successfully', { productId, updatedInfo });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminDeleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId);
            logger.info('Product deleted successfully', { productId });
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}

