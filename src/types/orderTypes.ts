import { OrderItemStatus, Status } from "@mytypes/enumTypes";

export interface Order{
    _id: string;
    userId: string,
    total: number,
    timestamp: Date,
    status: Status,
    items: OrderItem[],
    cancelledAt ?: Date | null,
    isDeleted?: boolean,
    deletedAt?: Date | null;
}

export interface OrderInput{
    _id?: string;
    userId: string,
    total: number,
    timestamp: Date,
    status: Status,
    items: OrderItemInput[],
    cancelledAt ?: Date | null,
    isDeleted?: boolean,
    deletedAt?: Date | null;
}

export interface OrderItem {
    _id: string;
    productId: string;
    quantity: number;
    sellerId: string;
    price: number;
    status: OrderItemStatus; // The status of each order item
}

export interface OrderItemInput {
    _id?: string;
    productId: string;
    quantity: number;
    sellerId: string;
    price: number;
    status: OrderItemStatus; // The status of each order item
}

export interface SellerOrder {
    _id: string;
    userId: string;
    timestamp: Date;
    isDeleted?: boolean;
    items: OrderItem[];
}