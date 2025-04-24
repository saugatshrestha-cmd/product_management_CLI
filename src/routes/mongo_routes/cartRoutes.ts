import { container } from "../../config/diContainer";
import express from 'express';
import { CartController } from '../../controller/cartController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(CartController);

router.use(AuthMiddleware.verifyToken);

// User routes
router.get('/user', RoleMiddleware.hasRole('user'), controller.getMyCart.bind(controller));
router.post('/', RoleMiddleware.hasRole('user'), controller.createMyCart.bind(controller));
router.put('/update', RoleMiddleware.hasRole('user'), controller.updateMyCart.bind(controller));
router.delete('/', RoleMiddleware.hasRole('user'), controller.removeFromMyCart.bind(controller));
router.get('/summary', RoleMiddleware.hasRole('user'), controller.getMyCartSummary.bind(controller));

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), controller.getAllCarts.bind(controller));
router.get('/:id', RoleMiddleware.hasRole('admin'), controller.getCartByUserId.bind(controller));
router.get('/:id/summary', RoleMiddleware.hasRole('admin'), controller.getSummaryByUserId.bind(controller));
router.post('/', RoleMiddleware.hasRole('admin'), controller.createCartByAdmin.bind(controller));
router.put('/:id', RoleMiddleware.hasRole('admin'), controller.updateCartByAdmin.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.deleteCartByAdmin.bind(controller));


export default router;