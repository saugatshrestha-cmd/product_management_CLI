import { container } from "@config/diContainer";
import express from 'express';
import { SellerController } from '@controller/sellerController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(SellerController);

router.use(AuthMiddleware.verifyToken);

// seller routes
router.get('/', RoleMiddleware.hasRole('seller'), controller.getProfile.bind(controller));
router.post('/', RoleMiddleware.hasRole('seller'), controller.createSeller.bind(controller))
router.put('/update', RoleMiddleware.hasRole('seller'), controller.updateProfile.bind(controller));
router.put('/change-email', RoleMiddleware.hasRole('seller'), controller.updateEmail.bind(controller));
router.put('/change-password', RoleMiddleware.hasRole('seller'), controller.updatePassword.bind(controller));

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), controller.getAllSellers.bind(controller));
router.get('/:id', RoleMiddleware.hasRole('admin'), controller.getSellerById.bind(controller));
router.put('/:id', RoleMiddleware.hasRole('admin'), controller.adminUpdateSeller.bind(controller));
router.put('/:id/change-password', RoleMiddleware.hasRole('admin'), controller.adminUpdatePassword.bind(controller));
router.put('/:id/change-email', RoleMiddleware.hasRole('admin'), controller.adminUpdateEmail.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.deleteSeller.bind(controller));

export default router;
