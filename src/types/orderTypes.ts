import { CartItem } from "./cartTypes";
import { ID } from "./commonTypes";

export enum OrderStatus {
    PENDING = 'Pending',
    CONFIRMED = 'Confirmed',
    SHIPPED = 'Shipped',
    DELIVERED = 'Delivered',
    CANCELLED = 'Cancelled'
}


export interface Order{
    id: ID,
    userId: number,
    total: number,
    timestamp: Date,
    status: OrderStatus,
    items: CartItem[]
}