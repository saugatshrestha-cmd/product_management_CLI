import express, { Request, Response } from 'express';
import { CategoryService } from '../../services/categoryService';

const router = express.Router();
const categoryService = new CategoryService();


router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const result = await categoryService.getCategoryById(categoryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const categoryId = req.body;
    const result = await categoryService.createCategory(categoryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const updatedInfo = req.body;
    const result = await categoryService.updateCategory(categoryId, updatedInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const categoryId = Number(req.params.id);
    const result = await categoryService.deleteCategory(categoryId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
});

export default router;
