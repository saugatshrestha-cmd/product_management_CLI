import { Request, Response } from 'express';
import { OrderService } from '@services/orderService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";

@injectable()
export class OrderController {
    constructor(
                @inject("OrderService") private orderService: OrderService
            ) {}
    async getUserOrders(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }

        try {
            const result = await this.orderService.getOrderByUserId(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching user orders' });
        }
    }

    async updateOrderItemStatus(req: AuthRequest, res: Response): Promise<void> {
        const sellerId = req.user?._id;
        if (!sellerId){
            res.status(400).json({ message: "No id in token" });
            return;
        }
        const { orderId, itemId } = req.body;
        const newStatus = req.body.status;
        try {
            const result = await this.orderService.updateOrderItemStatus(orderId, itemId, sellerId, newStatus);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating order item status'})
        }
    }

    async getSellerOrders(req: AuthRequest, res: Response): Promise<void> {
        const sellerId = req.user?._id;
        if (!sellerId){
            res.status(400).json({ message: "No id in token" });
            return;
        }

        try {
            const result = await this.orderService.getOrderBySellerId(sellerId);
            res.json(result);
        } catch (error){
            console.log(error)
            res.status(500).json({ message: 'Error fetching seller orders' });
        }
    }

    async createUserOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }

        try {
            const result = await this.orderService.createOrder(userId);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: 'Error creating order' });
        }
    }

    async cancelUserOrder(req: AuthRequest, res: Response): Promise<void> {
        const userId = req.user?._id;
        if (!userId){
            res.status(400).json({ message: "No id in token" });
            return;
        }

        const { orderId } = req.body;
        try {
            const result = await this.orderService.cancelOrder(orderId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error cancelling order' });
        }
    }

    async getAllOrders(req: Request, res: Response): Promise<void> {
        try {
            const orders = await this.orderService.getAllOrders();
            res.json(orders);
        } catch {
            res.status(500).json({ message: 'Error fetching orders' });
        }
    }

    async getOrderByUserId(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.orderService.getOrderByUserId(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching order' });
        }
    }

    async createOrderByAdmin(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.body.userId;
            const result = await this.orderService.createOrder(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error creating order' });
        }
    }

    async updateOrderStatus(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const updatedInfo = req.body;
            const result = await this.orderService.updateOrderStatus(orderId, updatedInfo);
            res.json(result);
            } catch {
            res.status(500).json({ message: 'Error updating order status' });
        }
    }

    async cancelOrderByAdmin(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const userId = req.body.userId;
            const result = await this.orderService.cancelOrder(orderId, userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error cancelling order' });
        }
    }

    async deleteOrder(req: Request, res: Response): Promise<void> {
        try {
            const orderId = req.params.id;
            const result = await this.orderService.deleteOrder(orderId);
            res.json(result);
        } catch {
        res.status(500).json({ message: 'Error deleting order' });
        }
    }
}
