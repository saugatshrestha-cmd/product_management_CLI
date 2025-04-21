import express, { Request, Response } from 'express';
import { CartService } from '../../services/cartService';
import { Product } from '../../types/productTypes';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();
const cartService = new CartService();


router.get('/', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const carts = await cartService.getAllCarts();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carts' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = await cartService.getCartByUserId(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

router.get('/:id/summary', async (req: Request, res: Response) => {
    try {
      const userId = Number(req.params.id);
      const result = await cartService.calculateCartSummary(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error calculating summary' });
    }
  });


router.post('/', async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;
    const product = { id: productId } as Product;
    const result = await cartService.createCart(product, quantity , userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating cart' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const { productId, amount } = req.body;

    const result = await cartService.updateItemQuantity(userId, productId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product quantity in cart' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const productId = Number(req.body.productId);
    const userId = Number(req.params.id);
    const result = await cartService.removeFromCart(productId, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cart' });
  }
});

export default router;
