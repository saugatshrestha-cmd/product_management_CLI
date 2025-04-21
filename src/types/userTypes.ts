import { ID } from "./commonTypes";
import { Role } from "./enumTypes";

export interface User {
    id : ID;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    address: string;
    role: Role;
}
