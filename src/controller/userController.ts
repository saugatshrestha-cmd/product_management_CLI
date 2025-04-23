import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserModel } from '../models/userModel';
import { AuthRequest } from '../types/authTypes';

const userService = new UserService();


export class UserController {
    static async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }
            const user = await UserModel.findOne({ _id: userId }).select("-password");
            if (!user){
                res.status(404).json({ message: "User not found" });
                return;
            }
            res.json(user);
        } catch {
            res.status(500).json({ message: "Error fetching user" });
        }
    }

    static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const updatedInfo = req.body;
            const result = await userService.updateUser(userId, updatedInfo);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating profile" });
        }
    }

    static async updateEmail(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await userService.updateEmail(userId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating email" });
        }
    }

    static async updatePassword(req: AuthRequest, res: Response): Promise<void> {
        try {
            const userId = req.user?._id;
            if (!userId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await userService.updatePassword(userId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating password" });
        }
    }

    static async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await userService.getAllUsers();
            res.json(users);
        } catch {
            res.status(500).json({ message: 'Error fetching users' });
        }
    }

    static async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await userService.getUserById(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching user' });
        }
    }

    static async adminUpdateUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await userService.updateUser(userId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating user' });
        }
    }

    static async adminUpdateEmail(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await userService.updateEmail(userId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating email' });
        }
    }

    static async adminUpdatePassword(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await userService.updatePassword(userId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating password' });
        }
    }

    static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;
            const result = await userService.deleteUser(userId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting user' });
        }
    }
}