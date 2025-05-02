import { Role } from "@mytypes/enumTypes";

export interface Seller {
    _id: string;
    storeName: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    role: Role;
    isDeleted?: boolean,
    deletedAt?: Date | null;
}
