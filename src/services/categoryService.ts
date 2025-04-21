import { CategoryRepository } from "../repository/mongo_repo/categoryRepo";
import { Category } from "../types/categoryTypes";

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(categoryData: Omit<Category, 'id'>): Promise<{ message: string }> {
    const { name, description } = categoryData;

    if (await this.categoryRepository.findByName(name)) {
      return { message: "Category already exists" };
    }

    await this.categoryRepository.addCategory(categoryData);
    return { message: "Category added successfully" };
  }

  async getCategoryById(categoryId: number): Promise<Category | { message: string }> {
    const category = await this.categoryRepository.findById(categoryId);
    return category || { message: "Category not found" };
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.getAll();
  }

  async updateCategory(categoryId: number, updatedInfo: Partial<Category>): Promise<{ message: string }> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      return { message: "Category not found" };
    }

    if (updatedInfo.name && await this.categoryRepository.findByName(updatedInfo.name)) {
      return { message: "Category name already exists" };
    }

    await this.categoryRepository.updateCategory(categoryId, updatedInfo);
    return { message: "Category updated successfully" };
  }

  async deleteCategory(categoryId: number): Promise<{ message: string }> {
    const success = await this.categoryRepository.deleteCategoryById(categoryId);
    return { message: success ? "Category deleted successfully" : "Category not found" };
  }
}
