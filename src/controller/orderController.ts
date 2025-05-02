import { Request, Response, NextFunction } from 'express';
import { OrderService } from '@services/orderService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';

@injectable()
export class OrderController {
    constructor(
                @inject("OrderService") private orderService: OrderService
            ) {}
    async getUserOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        try {
            const result = await this.orderService.getOrderByUserId(userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateOrderItemStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const sellerId = req.user?._id as string;
        const { orderId, itemId } = req.body;
        const newStatus = req.body.status;
        try {
            const result = await this.orderService.updateOrderItemStatus(orderId, itemId, sellerId, newStatus);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getSellerOrders(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const sellerId = req.user?._id as string;
        try {
            const result = await this.orderService.getOrderBySellerId(sellerId);
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async createUserOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        try {
            const result = await this.orderService.createOrder(userId);
            handleSuccess(res, result);
        } catch(error){
            handleError(next, error);
        }
    }

    async cancelUserOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        const userId = req.user?._id as string;
        const { orderId } = req.body;
        try {
            const result = await this.orderService.cancelOrder(orderId, userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async deleteUserOrder(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user?._id as string;
            const orderId = req.params.id;
            const result = await this.orderService.deleteOrder(orderId, userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getAllOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orders = await this.orderService.getAllOrders();
            res.json(orders);
        } catch(error) {
            handleError(next, error);
        }
    }

    async getOrderByUserId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.orderService.getOrderByUserId(userId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orderId = req.params.id;
            const updatedInfo = req.body;
            const result = await this.orderService.updateOrderStatus(orderId, updatedInfo);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async cancelOrderByAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orderId = req.params.id;
            const result = await this.orderService.cancelOrderAdmin(orderId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }

    async deleteOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const orderId = req.params.id;
            const result = await this.orderService.deleteOrderAdmin(orderId);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
}
