import { CartItem } from "./cartTypes";
import { ID } from "./commonTypes";
import { Status } from "./enumTypes";

export interface Order{
    _id: string;
    userId: string,
    total: number,
    timestamp: Date,
    status: Status,
    items: CartItem[],
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
    items: CartItem[],
    cancelledAt ?: Date | null,
    isDeleted?: boolean,
    deletedAt?: Date | null;
}