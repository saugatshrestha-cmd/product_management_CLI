import { ID } from "./commonTypes";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    sellerId: string;
}

export interface ProductInput {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    sellerId: string;
}
