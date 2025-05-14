import { container } from "@config/diContainer";
import express from 'express';
import { AdminController } from '@controller/adminController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { Validator } from "@middleware/validationMiddleware";
import { createUserSchema, updateUserSchema, updateUserEmailSchema, updateUserPasswordSchema } from "@validation/userValidation";

const router = express.Router();
const controller = container.resolve(AdminController);


router.get('/', AuthMiddleware.verifyToken, controller.getProfile.bind(controller));
router.post('/', new Validator(createUserSchema).validate(), controller.createAdmin.bind(controller));
router.put('/update', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), new Validator(updateUserSchema).validate(), controller.updateProfile.bind(controller));
router.put('/change-email', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), new Validator(updateUserEmailSchema).validate(), controller.updateEmail.bind(controller));
router.put('/change-password', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), new Validator(updateUserPasswordSchema).validate(), controller.updatePassword.bind(controller));
router.delete('/:id', AuthMiddleware.verifyToken, RoleMiddleware.hasRole('admin'), controller.deleteAdmin.bind(controller));


export default router;
