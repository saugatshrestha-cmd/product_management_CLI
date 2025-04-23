import express from 'express';
import { CartController } from '../../controller/cartController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

// User routes
router.get('/my', RoleMiddleware.hasRole('user'), CartController.getMyCart);
router.post('/', RoleMiddleware.hasRole('user'), CartController.createMyCart);
router.put('/update', RoleMiddleware.hasRole('user'), CartController.updateMyCart);
router.delete('/', RoleMiddleware.hasRole('user'), CartController.removeFromMyCart);
router.get('/summary', RoleMiddleware.hasRole('user'), CartController.getMyCartSummary);

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), CartController.getAllCarts);
router.get('/:id', RoleMiddleware.hasRole('admin'), CartController.getCartByUserId);
router.get('/:id/summary', RoleMiddleware.hasRole('admin'), CartController.getSummaryByUserId);
router.post('/', RoleMiddleware.hasRole('admin'), CartController.createCartByAdmin);
router.put('/:id', RoleMiddleware.hasRole('admin'), CartController.updateCartByAdmin);
router.delete('/:id', RoleMiddleware.hasRole('admin'), CartController.deleteCartByAdmin);


export default router;