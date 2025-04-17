import express, { Request, Response } from 'express';
import { CartService } from '../../services/cartService';
import { Product } from '../../types/productTypes';

const router = express.Router();
const cartService = new CartService();


router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = cartService.getCartByUserId(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
});

router.get('/:id/total', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const result = cartService.calculateTotal(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching category' });
    }
  });


router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;
    const product = { id: productId } as Product;
    const result = cartService.createCart(product, quantity , userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.body.productId);
    const userId = Number(req.params.id);
    const result = cartService.removeFromCart(productId, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' });
  }
});

export default router;
