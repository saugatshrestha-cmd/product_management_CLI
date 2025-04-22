import { Role } from "./enumTypes";
import { ID } from "./commonTypes";

export interface Seller {
    _id: string;
    storeName: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    role: Role;
}
