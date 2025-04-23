import express from 'express';
import { SellerController } from '../../controller/sellerController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

// seller routes
router.get('/my', RoleMiddleware.hasRole('seller'), SellerController.getProfile);
router.post('/', RoleMiddleware.hasRole('seller'), SellerController.createSeller)
router.put('/update', RoleMiddleware.hasRole('seller'), SellerController.updateProfile);
router.put('/change-email', RoleMiddleware.hasRole('seller'), SellerController.updateEmail);
router.put('/change-password', RoleMiddleware.hasRole('seller'), SellerController.updatePassword);

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), SellerController.getAllSellers);
router.get('/:id', RoleMiddleware.hasRole('admin'), SellerController.getSellerById);
router.put('/:id', RoleMiddleware.hasRole('admin'), SellerController.adminUpdateSeller);
router.put('/:id/change-password', RoleMiddleware.hasRole('admin'), SellerController.adminUpdatePassword);
router.put('/:id/change-email', RoleMiddleware.hasRole('admin'), SellerController.adminUpdateEmail);
router.delete('/:id', RoleMiddleware.hasRole('admin'), SellerController.deleteSeller);

export default router;
