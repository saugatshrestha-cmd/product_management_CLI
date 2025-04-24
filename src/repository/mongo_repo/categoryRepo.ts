import { injectable } from "tsyringe";
import { CategoryModel } from '../../models/categoryModel';
import { Category } from '../../types/categoryTypes';

@injectable()
export class CategoryRepository {

  async getAll(): Promise<Category[]> {
    return await CategoryModel.find();
  }

  async findById(categoryId: string): Promise<Category | null> {
    return await CategoryModel.findOne({ _id: categoryId });
  }

  async findByName(name: string): Promise<Category | null> {
    return await CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  async addCategory(categoryData: Category): Promise<void> {
    const newCategory = new CategoryModel(categoryData );
    await newCategory.save();
    return;
  }

  async updateCategory(categoryId: string, updatedInfo: Partial<Category>): Promise<void> {
    await CategoryModel.updateOne({ _id: categoryId }, updatedInfo);
  }

  async deleteCategoryById(categoryId: string): Promise<boolean> {
    const result = await CategoryModel.deleteOne({ _id: categoryId });
    return result.deletedCount === 1;
  }
}
