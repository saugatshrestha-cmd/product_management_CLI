import { Request, Response, NextFunction } from 'express';
import { ProductService } from '@services/productService';
import { handleSuccess, handleError } from '@utils/apiResponse';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";


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
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async getProductBySeller(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const sellerId = req.user?._id as string;
            const products = await this.productService.getProductsBySeller(sellerId);
            handleSuccess(res, products);
            res.json(products);
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
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const result = await this.productService.getAllProducts();
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.getProductById(productId);
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
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async adminDeleteProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const productId = req.params.id;
            const result = await this.productService.deleteProduct(productId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}

