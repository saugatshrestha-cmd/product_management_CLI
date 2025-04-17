import { ID } from "./commonTypes";

export interface User {
    id : ID;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: number;
    address: string;
}
