import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';

const categoryService = new CategoryService();

export class CategoryController {
    static async createCategory(req: Request, res: Response): Promise<void> {
        try{
            const newCategory = req.body;
            const result = await categoryService.createCategory(newCategory);
            res.json(result);
        } catch {
            res.status(500).json({ message: "Error creating category" })
        }
    }
    static async getAllCategories(req: Request, res: Response): Promise<void> {
            try {
                const users = await categoryService.getAllCategories();
                res.json(users);
            } catch {
                res.status(500).json({ message: 'Error fetching users' });
            }
        }
    
        static async getCategoryById(req: Request, res: Response): Promise<void> {
            try {
                const userId = req.params.id;
                const result = await categoryService.getCategoryById(userId);
                res.json(result);
            } catch {
                res.status(500).json({ message: 'Error fetching user' });
            }
        }
    
        static async updateCategory(req: Request, res: Response): Promise<void> {
            try {
                const userId = req.params.id;
                const result = await categoryService.updateCategory(userId, req.body);
                res.json(result);
            } catch {
                res.status(500).json({ message: 'Error updating user' });
            }
        }
    
        static async deleteCategory(req: Request, res: Response): Promise<void> {
            try {
                const userId = req.params.id;
                const result = await categoryService.deleteCategory(userId);
                res.json(result);
            } catch {
                res.status(500).json({ message: 'Error deleting user' });
            }
        }
}


