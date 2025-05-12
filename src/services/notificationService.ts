import { injectable, inject } from "tsyringe";
import { EmailService } from "./etherealEmailService";
import { getEmailTemplate } from "@utils/emailTemplates";
import { Order } from "@mytypes/orderTypes";
import { User } from "@mytypes/userTypes";
import { Seller } from "@mytypes/sellerTypes";
import { logger } from "@utils/logger";

@injectable()
export class NotificationService {
    constructor(
        @inject("EmailService") private emailService: EmailService
    ) {}

    async sendWelcomeEmail(user: User): Promise<void> {
        try {
            const { html, text } = getEmailTemplate('welcome', {
            name: user.firstName || user.email.split('@')[0]
            });
            await this.emailService.sendEmail({
                to: user.email,
                subject: 'Welcome to Our E-commerce Platform!',
                templateName: 'welcome', 
                templateData: { name: user.firstName || user.email.split('@')[0] }, 
                html,  
                text   
            });
        } catch (error) {
            logger.error('Failed to send welcome email', { error, userId: user._id });
            throw error;
        }
    }

    async sendWelcomeEmailSeller(seller: Seller): Promise<void> {
        try {
            const { html, text } = getEmailTemplate('welcome', {
            name: seller.storeName || seller.email.split('@')[0]
            });
            await this.emailService.sendEmail({
                to: seller.email,
                subject: 'Welcome to Our E-commerce Platform!',
                templateName: 'welcome', 
                templateData: { name: seller.storeName || seller.email.split('@')[0] }, 
                html,  
                text   
            });
        } catch (error) {
            logger.error('Failed to send welcome email', { error, userId: seller._id });
            throw error;
        }
    }

    async sendOrderConfirmation(order: Order, user: User, productNames: string): Promise<void> {
        try {
            const total = order.total.toFixed(2);  
            const { html, text } = getEmailTemplate('orderConfirmation', {
                orderId: order._id.toString(),
                productName: productNames,
                total: order.total.toFixed(2)
            });
            await this.emailService.sendEmail({
                to: user.email,
                subject: `Order Confirmation #${order._id}`,
                templateName: 'orderConfirmation',
                templateData: { orderId: order._id.toString(), productName: productNames, total: total}, 
                html,  
                text  
            });
        } catch (error) {
            logger.error('Failed to send order confirmation', { error, orderId: order._id });
            throw error;
        }
    }

    async sendOrderShippedNotification(order: Order, user: User, productName: string): Promise<void> {
        try {
            const { html, text } = getEmailTemplate('orderShipped', {
                orderId: order._id.toString(),
                productName
            });
            await this.emailService.sendEmail({
                to: user.email,
                subject: `Your Order #${order._id} Has Shipped!`,
                templateName: 'orderShipped', 
                templateData: { orderId: order._id.toString(), productName }, 
                html,  
                text   
            });
        } catch (error) {
            logger.error('Failed to send shipping notification', { error, orderId: order._id });
            throw error;
        }
    }
}
