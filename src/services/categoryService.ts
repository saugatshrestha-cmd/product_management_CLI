import { injectable, inject } from "tsyringe";
import { CategoryRepository } from "@repository/categoryRepo";
import { AppError } from "@utils/errorHandler";
import { Category } from "@mytypes/categoryTypes";
import { RepositoryFactory } from "@repository/baseRepo";

@injectable()
export class CategoryService {
  private categoryRepository: CategoryRepository;
  constructor(
    @inject(RepositoryFactory) private repositoryFactory: RepositoryFactory
  ) {
    this.categoryRepository = this.repositoryFactory.getCategoryRepository();
  }

  async createCategory(categoryData: Category): Promise<{ message: string }> {
    const { name, description } = categoryData;

    if (await this.categoryRepository.findByName(name)) {
      throw AppError.conflict( "Category already exists" )
    }

    await this.categoryRepository.add(categoryData);
    return { message: "Category added successfully" };
  }

  async getCategoryById(categoryId: string): Promise<Category | { message: string }> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw AppError.notFound("Category not found", categoryId);
    }
    return category;
  }

  async getAllCategories(): Promise<Category[]> {
    return await this.categoryRepository.getAll();
  }

  async updateCategory(categoryId: string, updatedInfo: Partial<Category>): Promise<{ message: string }> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw AppError.notFound("Category not found", categoryId);
    }

    if (updatedInfo.name && await this.categoryRepository.findByName(updatedInfo.name)) {
      throw AppError.conflict( "Category already exists" );
    }

    await this.categoryRepository.update(categoryId, updatedInfo);
    return { message: "Category updated successfully" };
  }

  async deleteCategory(categoryId: string): Promise<{ message: string }> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw AppError.notFound("Category not found", categoryId);
    }
    const success = await this.categoryRepository.deleteCategoryById(categoryId);
    if (!success) {
      throw AppError.internal("Failed to delete category");
    }  
    return { message: "Category deleted successfully" };
  }
}
