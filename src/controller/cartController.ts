import { Request, Response, NextFunction } from 'express';
import { CartService } from '@services/cartService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';
import { logger } from '@utils/logger';


@injectable()
export class CartController {
    constructor(
                @inject("CartService") private cartService: CartService
            ) {}

    async getMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        try {
            const cart = await this.cartService.getCartByUserId(userId);
            logger.info(`[${req.method}] ${req.originalUrl} - Successfully retrieved cart for user: ${userId}`);
            handleSuccess(res, cart);
        } catch(error) {
            handleError(next, error);
        }
    }

    async createMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        const { productId, quantity } = req.body;
        try {
            const result = await this.cartService.createCart(productId, quantity, userId, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Cart created for user: ${userId} with product: ${productId}, quantity: ${quantity}`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        const { productId, quantity } = req.body;
        try {
            const result = await this.cartService.updateItemQuantity(userId, productId, quantity, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Updated cart for user: ${userId} with product: ${productId}, new quantity: ${quantity}`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async removeFromMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        const { productId } = req.body;
        try {
            const result = await this.cartService.removeFromCart(productId, userId, req);
            logger.info(`[${req.method}] ${req.originalUrl} - Removed product: ${productId} from cart for user: ${userId}`);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getMyCartSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        try {
            const summary = await this.cartService.calculateCartSummary(userId);
            logger.info(`[${req.method}] ${req.originalUrl} - Successfully retrieved cart summary for user: ${userId}`);
            handleSuccess(res, summary);
        } catch(error) {
            handleError(next, error);
        }
    }
}
