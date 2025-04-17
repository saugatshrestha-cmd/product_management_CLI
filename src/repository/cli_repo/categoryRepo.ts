import { FileService } from '../../utils/fileHelper';
import FILE_PATHS from '../../constants/filePaths';
import { Category } from '../../types/categoryTypes';

export class CategoryRepository {
  private fileService: FileService;
  private categories: Category[];

  constructor() {
    this.fileService = new FileService(FILE_PATHS.CATEGORIES);
    this.categories = this.fileService.load();
  }

  private getNewId(): number {
    return this.categories.length ? this.categories[this.categories.length - 1].id + 1 : 1;
  }

  public saveCategories(): void {
    this.fileService.save({ data: this.categories });
  }

  private getCategories(): Category[] {
    return this.fileService.load();
  }

  getAll(): Category[] {
    return this.getCategories();
  }

  addCategory(categoryData: Omit<Category, 'id'>): void {
    const newCategory: Category = {
      id: this.getNewId(),
      ...categoryData,
    };
    this.categories.push(newCategory);
    this.saveCategories();
  }

  deleteCategoryById(categoryId: number): boolean {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(category => category.id !== categoryId);
    this.saveCategories();
    return initialLength !== this.categories.length;
  }
}
