import { Request, Response } from 'express';
import { CategoryService } from '@services/categoryService';
import { injectable, inject } from "tsyringe";


@injectable()
export class CategoryController {
    constructor(
                @inject("CategoryService") private categoryService: CategoryService
            ) {}

    async createCategory(req: Request, res: Response): Promise<void> {
        try{
            const newCategory = req.body;
            const result = await this.categoryService.createCategory(newCategory);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error creating category" })
        }
    }
    async getAllCategories(req: Request, res: Response): Promise<void> {
            try {
                const users = await this.categoryService.getAllCategories();
                res.json(users);
            } catch {
                res.status(500).json({ message: 'Error fetching users' });
            }
        }
    
        async getCategoryById(req: Request, res: Response): Promise<void> {
            try {
                const userId = req.params.id;
                const result = await this.categoryService.getCategoryById(userId);
                res.json(result);
            } catch {
                res.status(500).json({ message: 'Error fetching user' });
            }
        }
    
        async updateCategory(req: Request, res: Response): Promise<void> {
            try {
                const userId = req.params.id;
                const result = await this.categoryService.updateCategory(userId, req.body);
                res.json(result);
            } catch {
                res.status(500).json({ message: 'Error updating user' });
            }
        }
    
        async deleteCategory(req: Request, res: Response): Promise<void> {
            try {
                const userId = req.params.id;
                const result = await this.categoryService.deleteCategory(userId);
                res.json(result);
            } catch {
                res.status(500).json({ message: 'Error deleting user' });
            }
        }
}


