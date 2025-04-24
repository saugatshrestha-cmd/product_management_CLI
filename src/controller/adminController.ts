import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest } from '../types/authTypes';
import { injectable, inject } from "tsyringe";

@injectable()
export class AdminController {
    constructor(
                @inject("UserService") private userService: UserService
            ) {}
    async createAdmin(req: Request, res: Response): Promise<void>{
        try{
            const newAdmin = req.body;
            const result = await this.userService.createAdmin(newAdmin);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error creating admin" })
        }
    }

    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }
            const user = await this.userService.getUserById(userId);
            if (!user){
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.json(user);
        } catch {
            res.status(500).json({ message: "Error fetching user" });
        }
    }

    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const updatedInfo = req.body;
            const result = await this.userService.updateUser(userId, updatedInfo);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating profile" });
        }
    }

    async updateEmail(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await this.userService.updateEmail(userId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating email" });
        }
    }

    async updatePassword(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await this.userService.updatePassword(userId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating password" });
        }
    }

    async deleteAdmin(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await this.userService.deleteUser(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting user' });
        }
    }
}