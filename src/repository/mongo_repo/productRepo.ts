import { injectable } from "tsyringe";
import { ProductModel } from '@models/productModel';
import { Product, ProductInput } from '@mytypes/productTypes';
import { ProductStatus } from "@mytypes/enumTypes";
import { ProductRepository } from "@mytypes/repoTypes";

@injectable()
export class MongoProductRepository implements ProductRepository {

  async getAll(): Promise<Product[]> {
    return await ProductModel.find();
  }

  async findById(productId: string): Promise<Product | null> {
    return await ProductModel.findOne({ _id: productId, status: { $ne: ProductStatus.DELETED } }).select('-deletedAt');
  }

  async findByName(name: string): Promise<Product | null> {
    return await ProductModel.findOne({ name, status: { $ne: ProductStatus.DELETED } });
  }

  async add(productData: ProductInput): Promise<void> {
    const newProduct = new ProductModel(productData);
    await newProduct.save();
  }

  async update(productId: string, updatedInfo: Partial<Product>): Promise<void> {
    await ProductModel.updateOne({ _id: productId }, updatedInfo);
  }

  async updateMany(filter: object, update: object): Promise<void> {
    await ProductModel.updateMany(filter, update);
  }

  async getBySellerId(sellerId: string): Promise<Product[]> {
    return ProductModel.find({ sellerId, status: { $ne: ProductStatus.DELETED } });
  }
}
