import { Request, Response } from 'express';
import { CartService } from '../services/cartService';
import { AuthRequest } from '../types/authTypes';

const cartService = new CartService();

export class CartController {
    static async getAllCarts(req: Request, res: Response): Promise<void> {
        try {
            const carts = await cartService.getAllCarts();
            res.json(carts);
        } catch {
            res.status(500).json({ message: 'Error fetching carts' });
        }
    }

    static async getMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        try {
            const cart = await cartService.getCartByUserId(userId);
            if (!cart){
                res.status(404).json({ message: 'Cart not found' });
                return;
            }
            res.json(cart);
        } catch {
            res.status(500).json({ message: 'Error fetching cart' });
        }
    }

    static async createMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        const { productId, quantity } = req.body;
        try {
            const result = await cartService.createCart(productId, quantity, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error creating cart' });
        }
    }

    static async updateMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        const { productId, amount } = req.body;
        try {
            const result = await cartService.updateItemQuantity(userId, productId, amount);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating cart' });
        }
    }

    static async removeFromMyCart(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        const { productId } = req.body;
        try {
            const result = await cartService.removeFromCart(productId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error removing item' });
        }
    }

    static async getMyCartSummary(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        try {
            const summary = await cartService.calculateCartSummary(userId);
            if (!summary){
                res.status(404).json({ message: 'Summary not found' });
            }
            res.json(summary);
        } catch {
            res.status(500).json({ message: 'Error calculating summary' });
        }
    }

    static async getCartByUserId(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        try {
            const result = await cartService.getCartByUserId(userId);
            res.json(result);
        } catch {
        res.status(500).json({ message: 'Error fetching cart' });
        }
    }

    static async getSummaryByUserId(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        try {
            const result = await cartService.calculateCartSummary(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error calculating summary' });
        }
    }

    static async createCartByAdmin(req: Request, res: Response): Promise<void> {
        const { userId, productId, quantity } = req.body;
        try {
            const result = await cartService.createCart(productId, quantity, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error creating cart' });
        }
    }

    static async updateCartByAdmin(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const { productId, amount } = req.body;
        try {
            const result = await cartService.updateItemQuantity(userId, productId, amount);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating cart' });
        }
    }

    static async deleteCartByAdmin(req: Request, res: Response): Promise<void> {
        const userId = req.params.id;
        const { productId } = req.body;
        try {
            const result = await cartService.removeFromCart(productId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting cart' });
        }
    }
}
