import { CategoryRepository } from "../repository/cli_repo/categoryRepo";
import { Category } from "../types/categoryTypes";

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  // Check if a category exists by name
  private isCategoryExists(name: string): boolean {
    return this.categoryRepo.getAll().some(
      category => category.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Find category by id
  public findCategoryById(categoryId: number): Category | undefined {
    return this.categoryRepo.getAll().find(
      category => category.id === categoryId
    );
  }

  // Create a new category
  createCategory(categoryData: Omit<Category, 'id'>) {
    const { name } = categoryData;

    // Check if category exists
    if (this.isCategoryExists(name)) {
      return { message: "Category already exists" };
    }

    // Add the category
    this.categoryRepo.addCategory(categoryData);
    return { message: "Category added successfully" };
  }

  // Get category by id
  getCategoryById(categoryId: number) {
    const category = this.findCategoryById(categoryId);
    return category || { message: "Category not found" };
  }

  // Get all categories
  getAllCategories(): Category[] {
    return this.categoryRepo.getAll();
  }

  // Update category details
  updateCategory(categoryId: number, updatedInfo: Partial<Category>) {
    const category = this.findCategoryById(categoryId);
    if (!category) {
      return { message: "Category not found" };
    }

    // Update category properties
    Object.assign(category, updatedInfo);
    this.categoryRepo.saveCategories();
    return { message: "Category updated successfully" };
  }

  // Delete category by id
  deleteCategory(categoryId: number) {
    const success = this.categoryRepo.deleteCategoryById(categoryId);
    return { message: success ? "Category deleted successfully" : "Category not found" };
  }
}
