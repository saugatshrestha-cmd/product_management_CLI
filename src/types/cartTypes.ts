import { ID } from "./commonTypes";

export interface CartItem{
    productId: number,
    quantity: number
}

export interface Cart{
    id: ID,
    userId: number,
    items: CartItem[]
}