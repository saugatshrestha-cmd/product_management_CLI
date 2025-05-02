import { ProductStatus } from "./enumTypes";

export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    sellerId: string;
    status: ProductStatus;
    isDeleted?: boolean;
    deletedAt?: Date | null;
}

export interface ProductInput {
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: string;
    sellerId: string;
    status: ProductStatus;
    isDeleted?: boolean;
    deletedAt?: Date | null;
}
