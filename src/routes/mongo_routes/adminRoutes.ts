import { container } from "@config/diContainer";
import express from 'express';
import { AdminController } from '@controller/adminController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { Validator } from "@middleware/validationMiddleware";
import { createUserSchema, updateUserSchema, updateUserEmailSchema, updateUserPasswordSchema } from "@validation/userValidation";

const router = express.Router();
const controller = container.resolve(AdminController);

router.use(AuthMiddleware.verifyToken);


router.get('/', controller.getProfile.bind(controller));
router.post('/', RoleMiddleware.hasRole('admin'), new Validator(createUserSchema).validate(), controller.createAdmin.bind(controller));
router.put('/update', RoleMiddleware.hasRole('admin'), new Validator(updateUserSchema).validate(), controller.updateProfile.bind(controller));
router.put('/change-email', RoleMiddleware.hasRole('admin'), new Validator(updateUserEmailSchema).validate(), controller.updateEmail.bind(controller));
router.put('/change-password', RoleMiddleware.hasRole('admin'), new Validator(updateUserPasswordSchema).validate(), controller.updatePassword.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.deleteAdmin.bind(controller));


export default router;
