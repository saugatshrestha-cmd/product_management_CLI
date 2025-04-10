import { getCartByUserId, calculateTotal } from './cartService.js';
import { orders, addOrder, saveOrders } from '../repository/orderRepo.js';
import { OrderStatus } from '../types/orderTypes.js';
import { CartItem } from '../types/cartTypes.js';

function createOrder(userId: number) {
    const cart = getCartByUserId(userId);

    if ('message' in cart) {
        return { message: `Cannot place order: ${cart.message}` };
    }

    const totalResult = calculateTotal(userId);
    if ('message' in totalResult) {
        return { message: `Cannot calculate total: ${totalResult.message}` };
    }

    const order = addOrder({
        userId,
        items: cart.items as CartItem[], 
        total: totalResult.total,
        timestamp: new Date(),
        status: OrderStatus.PENDING,
    });

    return { message: "Order created successfully" };;
}

function getOrderByUserId(userId: number) {
    
    const userOrders = orders.filter(order => order.userId === userId);
    
    if (userOrders.length === 0) {
        return { message: `No orders found for userId: ${userId}` };
    }

    return userOrders;
}

function updateOrderStatus(orderId: number, newStatus: OrderStatus) {
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        return { message: `Order with id ${orderId} not found.` };
    }

    order.status = newStatus;
    saveOrders();

    return { message: `Order status updated to ${newStatus}.`};
}

export {
    createOrder,
    getOrderByUserId,
    updateOrderStatus
};
