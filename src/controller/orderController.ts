import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';
import { AuthRequest } from '../types/authTypes';

const orderService = new OrderService();

export class OrderController {
    static async getUserOrders(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }

        try {
            const result = await orderService.getOrderByUserId(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching user orders' });
        }
    }

    static async createUserOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }

        try {
            const result = await orderService.createOrder(userId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating order' });
        }
    }

    static async cancelUserOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }

        const { orderId } = req.body;
        try {
            const result = await orderService.cancelOrder(orderId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error cancelling order' });
        }
    }

    static async getAllOrders(req: Request, res: Response): Promise<void> {
        try {
            const orders = await orderService.getAllOrders();
            res.json(orders);
        } catch {
            res.status(500).json({ message: 'Error fetching orders' });
        }
    }

    static async getOrderByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await orderService.getOrderByUserId(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching order' });
        }
    }

    static async createOrderByAdmin(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId;
            const result = await orderService.createOrder(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error creating order' });
        }
    }

    static async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const updatedInfo = req.body;
            const result = await orderService.updateOrderStatus(orderId, updatedInfo);
            res.json(result);
            } catch {
            res.status(500).json({ message: 'Error updating order status' });
        }
    }

    static async cancelOrderByAdmin(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const userId = req.body.userId;
            const result = await orderService.cancelOrder(orderId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error cancelling order' });
        }
    }

    static async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const result = await orderService.deleteOrder(orderId);
            res.json(result);
        } catch {
        res.status(500).json({ message: 'Error deleting order' });
        }
    }
}
