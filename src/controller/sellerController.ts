import { Request, Response } from 'express';
import { SellerService } from '../services/sellerService';
import { SellerModel } from '../models/sellerModel';
import { AuthRequest } from '../types/authTypes';

const sellerService = new SellerService();

export class SellerController {
    static async createSeller(req: Request, res: Response): Promise<void>{
        try{
            const newSeller = req.body;
            const result = await sellerService.createSeller(newSeller);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error creating seller" })
        }
    }

    static async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }
            const seller = await SellerModel.findOne({ id: sellerId }).select("-password");
            if (!seller){
                res.status(404).json({ message: "Seller not found" });
                return;
            }
            res.json(seller);
        } catch {
            res.status(500).json({ message: "Error fetching seller" });
        }
    }

    static async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const updatedInfo = req.body;
            const result = await sellerService.updateSeller(sellerId, updatedInfo);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating profile" });
        }
    }

    static async updateEmail(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await sellerService.updateEmail(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating email" });
        }
    }

    static async updatePassword(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await sellerService.updatePassword(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating password" });
        }
    }

    static async getAllSellers(req: Request, res: Response): Promise<void> {
        try {
            const sellers = await sellerService.getAllSellers();
            res.json(sellers);
        } catch {
            res.status(500).json({ message: 'Error fetching sellers' });
        }
    }

    static async getSellerById(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await sellerService.getSellerById(sellerId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching seller' });
        }
    }

    static async adminUpdateSeller(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await sellerService.updateSeller(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating seller' });
        }
    }

    static async adminUpdateEmail(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await sellerService.updateEmail(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating email' });
        }
    }

    static async adminUpdatePassword(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await sellerService.updatePassword(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating password' });
        }
    }

    static async deleteSeller(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await sellerService.deleteSeller(sellerId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting seller' });
        }
    }
}
