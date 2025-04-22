import express, { Request, Response } from 'express';
import { SellerService } from '../../services/sellerService';
import { ProductService } from '../../services/productService';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';
import { SellerModel } from '../../models/sellerModel';
import { AuthRequest } from '../../types/authTypes';

const router = express.Router();
const sellerService = new SellerService();
const productService = new ProductService();

// Get all Sellers
router.get('/', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const sellers = await sellerService.getAllSellers();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching1' });
  }
});

router.post('/', async (req, res) => {
    const sellerId = req.body;
  const result = await sellerService.createSeller(sellerId);
  res.status(201).json(result);
});

router.get('/profile/my-products', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('seller'), async (req: AuthRequest, res:Response): Promise<void> => {
  try {
    const sellerId = req.user?._id; // assuming req.user is populated from JWT
    if (!sellerId) {
      res.status(400).json({ message: "Seller ID is missing in request" });
      return
    }
    const products = await productService.getProductsBySeller(sellerId);

    if (!products.length) {
      res.status(404).json({ message: 'No products found for this seller' });
      return
    }

    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get("/profile", AuthMiddleware.verifyToken, RoleMiddleware.isSeller, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInSeller = (req as any).Seller;
    if (!loggedInSeller?._id) {
      res.status(400).json({ message: "No id in token" });
      return;
    }

    const seller = await SellerModel.findOne({ _id: loggedInSeller._id }).select("-password");

    if (!seller) {
      res.status(404).json({ message: "Seller not found" });
      return; 
    }

    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: "Error fetching Seller" });
  }
});

router.put("/profile/update", AuthMiddleware.verifyToken, RoleMiddleware.isSeller, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInSeller = (req as any).seller;
    if (!loggedInSeller?._id) {
      res.status(400).json({ message: "No SellerId in token" });
      return;
    }

    const updatedInfo = req.body;

    const result = await sellerService.updateSeller(loggedInSeller.id, updatedInfo);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.put("/profile/change-email", AuthMiddleware.verifyToken, RoleMiddleware.isSeller, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInSeller = (req as any).seller;
    if (!loggedInSeller?._id) {
      res.status(400).json({ message: "No SellerId in token" });
      return;
    }

    const newEmail = req.body;

    const result = await sellerService.updateEmail(loggedInSeller.id, newEmail);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.put("/profile/change-password", AuthMiddleware.verifyToken, RoleMiddleware.isSeller, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInSeller = (req as any).seller;
    if (!loggedInSeller?._id) {
      res.status(400).json({ message: "No SellerId in token" });
      return;
    }

    const newPassword = req.body;

    const result = await sellerService.updatePassword(loggedInSeller.id, newPassword);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.get('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const SellerId = req.params.id;
    const result = await sellerService.getSellerById(SellerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching2' });
  }
});

router.put('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const SellerId = req.params.id;
    const updatedInfo = req.body;
    const result = await sellerService.updateSeller(SellerId, updatedInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating Seller' });
  }
});

router.put('/:id/change-password', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const SellerId = req.params.id;
    const newPassword = req.body;

    const result = await sellerService.updatePassword(SellerId, newPassword);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

router.put('/:id/change-email', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const SellerId = req.params.id;
    const newEmail = req.body;

    const result = await sellerService.updateEmail(SellerId, newEmail);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

router.delete('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const SellerId = req.params.id;
    const result = await sellerService.deleteSeller(SellerId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Seller' });
  }
});

export default router;
