import express, { Request, Response } from 'express';
import { ProductService } from '../../services/productService';

const router = express.Router();
const productService = new ProductService();


router.get('/', async (req: Request, res: Response) => {
  try {
    const products = productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const result = productService.getProductById(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const productId = req.body;
    const result = productService.createProduct(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const updatedInfo = req.body;
    const result = productService.updateProduct(productId, updatedInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category' });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const result = productService.deleteProduct(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
});

export default router;
