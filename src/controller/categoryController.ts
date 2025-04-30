import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '@services/categoryService';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';


@injectable()
export class CategoryController {
    constructor(
                @inject("CategoryService") private categoryService: CategoryService
            ) {}

    async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try{
            const newCategory = req.body;
            const result = await this.categoryService.createCategory(newCategory);
            handleSuccess(res, result);
        } catch(error) {
            handleError(next, error);
        }
    }
    async getAllCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const result = await this.categoryService.getAllCategories();
                handleSuccess(res, result);
            } catch(error) {
                handleError(next, error);
            }
        }
    
        async getCategoryById(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const categoryId = req.params.id;
                const result = await this.categoryService.getCategoryById(categoryId);
                handleSuccess(res, result);
            } catch(error) {
                handleError(next, error);
            }
        }
    
        async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const categoryId = req.params.id;
                const updatedInfo = req.body;
                const result = await this.categoryService.updateCategory(categoryId, updatedInfo);
                handleSuccess(res, result);
            } catch(error) {
                handleError(next, error);
            }
        }
    
        async deleteCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
            try {
                const categoryId = req.params.id;
                const result = await this.categoryService.deleteCategory(categoryId);
                handleSuccess(res, result);
            } catch(error) {
                handleError(next, error);
            }
        }
}


