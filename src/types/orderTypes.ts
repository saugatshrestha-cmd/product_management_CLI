import { CartItem } from "./cartTypes";

export enum OrderStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}


export interface Order{
    id: number,
    userId: number,
    total: number,
    timestamp: Date,
    status: OrderStatus,
    items: CartItem[]
}