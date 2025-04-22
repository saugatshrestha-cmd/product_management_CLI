import { ProductModel } from '../../models/productModel';
import { Product, ProductInput } from '../../types/productTypes';

export class ProductRepository {

  async getAll(): Promise<Product[]> {
    return await ProductModel.find();
  }

  async findById(productId: string): Promise<Product | null> {
    return await ProductModel.findOne({ _id: productId });
  }

  async findByName(name: string): Promise<Product | null> {
    return await ProductModel.findOne({ name });
  }

  async addProduct(productData: ProductInput): Promise<void> {
    const newProduct = new ProductModel(productData);
    await newProduct.save();
  }

  async updateProduct(productId: string, updatedInfo: Partial<Product>): Promise<void> {
    await ProductModel.updateOne({ _id: productId }, updatedInfo);
  }

  async getBySellerId(sellerId: string): Promise<Product[]> {
    return ProductModel.find({ sellerId });
  }
  

  async deleteProductById(productId: string): Promise<boolean> {
    const result = await ProductModel.deleteOne({ _id: productId });
    return result.deletedCount === 1;
  }
}
