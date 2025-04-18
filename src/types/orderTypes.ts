import { CartItem } from "./cartTypes";
import { ID } from "./commonTypes";
import { Status } from "./enumTypes";

export interface Order{
    id: ID,
    userId: number,
    total: number,
    timestamp: Date,
    status: Status,
    items: CartItem[]
}