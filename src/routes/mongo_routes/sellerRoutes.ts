import { container } from "@config/diContainer";
import express from 'express';
import { SellerController } from '@controller/sellerController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { Validator } from "@middleware/validationMiddleware";
import { createSellerSchema, updateSellerSchema, updateSellerEmailSchema, updateSellerPasswordSchema } from "@validation/sellerValidation";

const router = express.Router();
const controller = container.resolve(SellerController);

router.use(AuthMiddleware.verifyToken);

// seller routes
router.get('/view', RoleMiddleware.hasRole('seller'), controller.getProfile.bind(controller));
router.post('/', new Validator(createSellerSchema).validate(), controller.createSeller.bind(controller));
router.put('/update', RoleMiddleware.hasRole('seller'), new Validator(updateSellerSchema).validate(), controller.updateProfile.bind(controller));
router.put('/change-email', RoleMiddleware.hasRole('seller'), new Validator(updateSellerEmailSchema).validate(), controller.updateEmail.bind(controller));
router.put('/change-password', RoleMiddleware.hasRole('seller'), new Validator(updateSellerPasswordSchema).validate(), controller.updatePassword.bind(controller));

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), controller.getAllSellers.bind(controller));
router.get('/:id', RoleMiddleware.hasRole('admin'), controller.getSellerById.bind(controller));
router.put('/:id', RoleMiddleware.hasRole('admin'), new Validator(updateSellerSchema).validate(), controller.adminUpdateSeller.bind(controller));
router.put('/:id/change-password', RoleMiddleware.hasRole('admin'), new Validator(updateSellerPasswordSchema).validate(), controller.adminUpdatePassword.bind(controller));
router.put('/:id/change-email', RoleMiddleware.hasRole('admin'), new Validator(updateSellerEmailSchema).validate(), controller.adminUpdateEmail.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.deleteSeller.bind(controller));

export default router;
