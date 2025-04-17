import { ID } from "./commonTypes";

export interface Product {
    id : ID;
    name: string;
    description: string;
    price: number;
    quantity: number;
    categoryId: number;
}
