import { CategoryModel } from '../../models/categoryModel';
import { Category } from '../../types/categoryTypes';

export class CategoryRepository {

  private async getNewId(): Promise<number> {
    const lastUser = await CategoryModel.findOne().sort({ id: -1 });
    return lastUser ? lastUser.id + 1 : 1;
  }

  async getAll(): Promise<Category[]> {
    return await CategoryModel.find();
  }

  async findById(categoryId: number): Promise<Category | null> {
    return await CategoryModel.findOne({ id: categoryId });
  }

  async findByName(name: string): Promise<Category | null> {
    return await CategoryModel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  async addCategory(categoryData: Omit<Category, 'id'>): Promise<void> {
    const newId = await this.getNewId();
    const newCategory = new CategoryModel({ id: newId, ...categoryData });
    await newCategory.save();
  }

  async updateCategory(categoryId: number, updatedInfo: Partial<Category>): Promise<void> {
    await CategoryModel.updateOne({ id: categoryId }, updatedInfo);
  }

  async deleteCategoryById(categoryId: number): Promise<boolean> {
    const result = await CategoryModel.deleteOne({ id: categoryId });
    return result.deletedCount === 1;
  }
}
