import { Request, Response } from 'express';
import { CartService } from '@services/cartService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";


@injectable()
export class CartController {
    constructor(
                @inject("CartService") private cartService: CartService
            ) {}
    async getAllCarts(req: Request, res: Response): Promise<void> {
        try {
            const carts = await this.cartService.getAllCarts();
            res.json(carts);
        } catch {
            res.status(500).json({ message: 'Error fetching carts' });
        }
    }

    async getMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        try {
            const cart = await this.cartService.getCartByUserId(userId);
            if (!cart){
                res.status(404).json({ message: 'Cart not found' });
                return;
            }
            res.json(cart);
        } catch {
            res.status(500).json({ message: 'Error fetching cart' });
        }
    }

    async createMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        const { productId, quantity } = req.body;
        try {
            const result = await this.cartService.createCart(productId, quantity, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error creating cart' });
        }
    }

    async updateMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        const { productId, amount } = req.body;
        try {
            const result = await this.cartService.updateItemQuantity(userId, productId, amount);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating cart' });
        }
    }

    async removeFromMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        const { productId } = req.body;
        try {
            const result = await this.cartService.removeFromCart(productId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error removing item' });
        }
    }

    async getMyCartSummary(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        try {
            const summary = await this.cartService.calculateCartSummary(userId);
            if (!summary){
                res.status(404).json({ message: 'Summary not found' });
            }
            res.json(summary);
        } catch {
            res.status(500).json({ message: 'Error calculating summary' });
        }
    }

    async getCartByUserId(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        try {
            const result = await this.cartService.getCartByUserId(userId);
            res.json(result);
        } catch {
        res.status(500).json({ message: 'Error fetching cart' });
        }
    }

    async getSummaryByUserId(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        try {
            const result = await this.cartService.calculateCartSummary(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error calculating summary' });
        }
    }

    async createCartByAdmin(req: Request, res: Response): Promise<void> {
        const { userId, productId, quantity } = req.body;
        try {
            const result = await this.cartService.createCart(productId, quantity, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error creating cart' });
        }
    }

    async updateCartByAdmin(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const { productId, amount } = req.body;
        try {
            const result = await this.cartService.updateItemQuantity(userId, productId, amount);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating cart' });
        }
    }

    async deleteCartByAdmin(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const { productId } = req.body;
        try {
            const result = await this.cartService.removeFromCart(productId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting cart' });
        }
    }
}
