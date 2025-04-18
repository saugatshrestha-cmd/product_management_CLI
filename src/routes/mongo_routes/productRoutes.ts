import express, { Request, Response } from 'express';
import { ProductService } from '../../services/productService';

const router = express.Router();
const productService = new ProductService();


router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const result = await productService.getProductById(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product' });
  }
});


router.post('/', async (req: Request, res: Response) => {
  try {
    const productId = req.body;
    const result = await productService.createProduct(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
});


router.put('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const updatedInfo = req.body;
    const result = await productService.updateProduct(productId, updatedInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
});


router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.params.id);
    const result = await productService.deleteProduct(productId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
});

export default router;
