import { ProductModel } from '../../models/productModel';
import { Product } from '../../types/productTypes';

export class ProductRepository {

  private async getNewId(): Promise<number> {
    const lastUser = await ProductModel.findOne().sort({ id: -1 });
    return lastUser ? lastUser.id + 1 : 1;
  }

  async getAll(): Promise<Product[]> {
    return await ProductModel.find();
  }

  async findById(productId: number): Promise<Product | null> {
    return await ProductModel.findOne({ id: productId });
  }

  async findByName(name: string): Promise<Product | null> {
    return await ProductModel.findOne({ name });
  }

  async addProduct(productData: Omit<Product, 'id'>): Promise<void> {
    const newId = await this.getNewId();
    const newProduct = new ProductModel({ id: newId, ...productData });
    await newProduct.save();
  }

  async updateProduct(productId: number, updatedInfo: Partial<Product>): Promise<void> {
    await ProductModel.updateOne({ id: productId }, updatedInfo);
  }

  async deleteProductById(productId: number): Promise<boolean> {
    const result = await ProductModel.deleteOne({ id: productId });
    return result.deletedCount === 1;
  }
}
