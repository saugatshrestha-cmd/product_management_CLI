import { Request, Response, NextFunction } from 'express';
import { CartService } from '@services/cartService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';


@injectable()
export class CartController {
    constructor(
                @inject("CartService") private cartService: CartService
            ) {}
    async getAllCarts(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const carts = await this.cartService.getAllCarts();
            handleSuccess(res, carts);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;

        try {
            const cart = await this.cartService.getCartByUserId(userId);
            handleSuccess(res, cart);
        } catch(error) {
            handleError(next, error);
        }
    }

    async createMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        const { productId, quantity } = req.body;
        try {
            const result = await this.cartService.createCart(productId, quantity, userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        const { productId, amount } = req.body;
        try {
            const result = await this.cartService.updateItemQuantity(userId, productId, amount);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async removeFromMyCart(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        const { productId } = req.body;
        try {
            const result = await this.cartService.removeFromCart(productId, userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getMyCartSummary(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        try {
            const summary = await this.cartService.calculateCartSummary(userId);
            handleSuccess(res, summary);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getCartByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        try {
            const result = await this.cartService.getCartByUserId(userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getSummaryByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        try {
            const result = await this.cartService.calculateCartSummary(userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateCartByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        const { productId, amount } = req.body;
        try {
            const result = await this.cartService.updateItemQuantity(userId, productId, amount);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async deleteCartByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        const userId = req.params.id;
        const { productId } = req.body;
        try {
            const result = await this.cartService.removeFromCart(productId, userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}
