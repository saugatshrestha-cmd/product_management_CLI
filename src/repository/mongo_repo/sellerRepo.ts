import { SellerModel } from '../../models/sellerModel';
import { Seller } from '../../types/sellerTypes';

export class SellerRepository {

    async getAll(): Promise<Seller[]> {
    return await SellerModel.find().select('-password');
    }

    async findById(sellerId: string): Promise<Seller | null> {
    return await SellerModel.findOne({ _id: sellerId }).select('-password');
    }

    async findByEmail(email: string): Promise<Seller | null> {
    return await SellerModel.findOne({ email });
    }

    async addSeller(sellerData: Seller): Promise<void> {
        const newSeller = new SellerModel(sellerData );
        await newSeller.save();
    }

    async updateSeller(sellerId: string, updatedInfo: Partial<Seller>): Promise<void> {
    await SellerModel.updateOne({ _id: sellerId }, updatedInfo);
    }

    async deleteSellerById(sellerId: string): Promise<boolean> {
    const result = await SellerModel.deleteOne({ _id: sellerId });
    return result.deletedCount === 1;
    }
}
