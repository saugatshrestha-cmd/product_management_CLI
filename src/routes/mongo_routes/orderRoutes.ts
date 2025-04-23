import express from 'express';
import { OrderController } from '../../controller/orderController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

// 🔒 User routes
router.get('/my', RoleMiddleware.hasRole('user'), OrderController.getUserOrders);
router.post('/', RoleMiddleware.hasRole('user'), OrderController.createUserOrder);
router.put('/cancel', RoleMiddleware.hasRole('user'), OrderController.cancelUserOrder);

// 🔐 Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), OrderController.getAllOrders);
router.get('/:id', RoleMiddleware.hasRole('admin'), OrderController.getOrderByUserId);
router.post('/', RoleMiddleware.hasRole('admin'), OrderController.createOrderByAdmin);
router.put('/:id', RoleMiddleware.hasRole('admin'), OrderController.updateOrderStatus);
router.put('/:id/cancel', RoleMiddleware.hasRole('admin'), OrderController.cancelOrderByAdmin);
router.delete('/:id', RoleMiddleware.hasRole('admin'), OrderController.deleteOrder);

export default router;
