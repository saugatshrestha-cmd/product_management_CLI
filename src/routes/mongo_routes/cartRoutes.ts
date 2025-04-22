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

router.get('/my-cart', AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUser = (req as any).user;

    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const result = await cartService.getCartByUserId(loggedInUser._id);
    if (!result) {
      res.status(404).json({ message: "Cart not found for this user" });
      return;
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

router.post('/my-cart', AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user;

    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const { productId, quantity } = req.body;

    const result = await cartService.createCart(productId, quantity, loggedInUser._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating cart' });
  }
});

router.put('/my-cart', AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user;

    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const { productId, amount } = req.body;

    const result = await cartService.updateItemQuantity(loggedInUser._id, productId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product quantity in cart' });
  }
});

router.get('/my-cart/summary', AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user;

    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const summary = await cartService.calculateCartSummary(loggedInUser._id);

    if (!summary) {
      res.status(404).json({ message: "Summary not found for this user" });
      return;
    }

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error calculating cart summary' });
  }
});

router.delete('/my-cart', AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response) => {
  try {
    const loggedInUser = (req as any).user;

    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const { productId } = req.body;

    const result = await cartService.removeFromCart(productId, loggedInUser._id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item from cart' });
  }
});

router.get('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await cartService.getCartByUserId(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

router.get('/:id/summary', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;
      const result = await cartService.calculateCartSummary(userId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: 'Error calculating summary' });
    }
  });


router.post('/', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const { userId, productId, quantity } = req.body;
    const result = await cartService.createCart(productId, quantity , userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error creating cart' });
  }
});

router.put('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { productId, amount } = req.body;

    const result = await cartService.updateItemQuantity(userId, productId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product quantity in cart' });
  }
});

router.delete('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;
    const userId = req.params.id;
    const result = await cartService.removeFromCart(productId, userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting cart' });
  }
});

export default router;
