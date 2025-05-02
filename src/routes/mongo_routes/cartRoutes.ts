import { container } from "@config/diContainer";
import express from 'express';
import { CartController } from '@controller/cartController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(CartController);

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.hasRole('customer'));

router.get('/user', controller.getMyCart.bind(controller));
router.post('/', controller.createMyCart.bind(controller));
router.put('/update', controller.updateMyCart.bind(controller));
router.delete('/', controller.removeFromMyCart.bind(controller));
router.get('/summary', controller.getMyCartSummary.bind(controller));

export default router;