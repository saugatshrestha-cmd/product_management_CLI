import { injectable } from "tsyringe";
import { ProductModel } from '@models/productModel';
import { Product, ProductInput } from '@mytypes/productTypes';

@injectable()
export class ProductRepository {

  async getAll(): Promise<Product[]> {
    return await ProductModel.find();
  }

  async findById(productId: string): Promise<Product | null> {
    return await ProductModel.findOne({ _id: productId, isDeleted: false }).select('-isDeleted -deletedAt');
  }

  async findByName(name: string): Promise<Product | null> {
    return await ProductModel.findOne({ name, isDeleted: false });
  }

  async addProduct(productData: ProductInput): Promise<void> {
    const newProduct = new ProductModel(productData);
    await newProduct.save();
  }

  async updateProduct(productId: string, updatedInfo: Partial<Product>): Promise<void> {
    await ProductModel.updateOne({ _id: productId }, updatedInfo);
  }

  async updateMany(filter: object, update: object): Promise<void> {
    await ProductModel.updateMany(filter, update);
  }

  async getBySellerId(sellerId: string): Promise<Product[]> {
    return ProductModel.find({ sellerId, isDeleted: false });
  }
}
