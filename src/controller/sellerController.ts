import { Request, Response } from 'express';
import { SellerService } from '@services/sellerService';
import { AuthRequest } from '@mytypes/authTypes';
import { injectable, inject } from "tsyringe";


@injectable()
export class SellerController {
    constructor(
            @inject("SellerService") private sellerService: SellerService
        ) {}

    async createSeller(req: Request, res: Response): Promise<void>{
        try{
            const newSeller = req.body;
            const result = await this.sellerService.createSeller(newSeller);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error creating seller" })
        }
    }

    async getProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }
            const seller = await this.sellerService.getSellerById(sellerId);
            if (!seller){
                res.status(404).json({ message: "Seller not found" });
                return;
            }
            res.json(seller);
        } catch {
            res.status(500).json({ message: "Error fetching seller" });
        }
    }

    async updateProfile(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const updatedInfo = req.body;
            const result = await this.sellerService.updateSeller(sellerId, updatedInfo);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating profile" });
        }
    }

    async updateEmail(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await this.sellerService.updateEmail(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating email" });
        }
    }

    async updatePassword(req: AuthRequest, res: Response): Promise<void> {
        try {
            const sellerId = req.user?._id;
            if (!sellerId){
                res.status(400).json({ message: "No id in token" });
                return;
            }

            const result = await this.sellerService.updatePassword(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error updating password" });
        }
    }

    async getAllSellers(req: Request, res: Response): Promise<void> {
        try {
            const sellers = await this.sellerService.getAllSellers();
            res.json(sellers);
        } catch {
            res.status(500).json({ message: 'Error fetching sellers' });
        }
    }

    async getSellerById(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.getSellerById(sellerId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error fetching seller' });
        }
    }

    async adminUpdateSeller(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.updateSeller(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating seller' });
        }
    }

    async adminUpdateEmail(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.updateEmail(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating email' });
        }
    }

    async adminUpdatePassword(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.updatePassword(sellerId, req.body);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error updating password' });
        }
    }

    async deleteSeller(req: Request, res: Response): Promise<void> {
        try {
            const sellerId = req.params.id;
            const result = await this.sellerService.deleteSeller(sellerId);
            res.json(result);
        } catch {
            res.status(500).json({ message: 'Error deleting seller' });
        }
    }
}
