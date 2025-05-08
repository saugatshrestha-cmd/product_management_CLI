import { Role } from "@mytypes/enumTypes";

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    role: Role;
    isDeleted?: boolean,
    deletedAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}
