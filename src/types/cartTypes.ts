import { ID } from "./commonTypes";

export interface CartItem{
    productId: string,
    quantity: number,
}

export interface Cart{
    _id: string;
    userId: string,
    items: CartItem[]
}

export interface CartInput{
    _id?: string;
    userId: string,
    items: CartItem[]
}