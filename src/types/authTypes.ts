import { Request } from "express";

interface User {
    _id?: string;
    role?: string;
}

export interface AuthRequest extends Request {
    user?: User;
}