import { injectable } from "tsyringe";
import { SellerModel } from '@models/sellerModel';
import { Seller } from '@mytypes/sellerTypes';

@injectable()
export class SellerRepository {

    async getAll(): Promise<Seller[]> {
    return await SellerModel.find().select('-password');
    }

    async findById(sellerId: string): Promise<Seller | null> {
    return await SellerModel.findOne({ _id: sellerId, isDeleted: false }).select('-password -isDeleted -deletedAt');
    }

    async findByEmail(email: string): Promise<Seller | null> {
    return await SellerModel.findOne({ email, isDeleted: false });
    }

    async addSeller(sellerData: Seller): Promise<void> {
        const newSeller = new SellerModel(sellerData );
        await newSeller.save();
    }

    async updateSeller(sellerId: string, updatedInfo: Partial<Seller>): Promise<void> {
    await SellerModel.updateOne({ _id: sellerId }, updatedInfo);
    }
}   
