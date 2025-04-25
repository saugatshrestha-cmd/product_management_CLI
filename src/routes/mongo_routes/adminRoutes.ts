import { container } from "@config/diContainer";
import express from 'express';
import { AdminController } from '@controller/adminController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(AdminController);

router.use(AuthMiddleware.verifyToken);


router.get('/', RoleMiddleware.hasRole('admin'), controller.getProfile.bind(controller));
router.post('/', RoleMiddleware.hasRole('admin'), controller.createAdmin.bind(controller));
router.put('/update', RoleMiddleware.hasRole('admin'), controller.updateProfile.bind(controller));
router.put('/change-email', RoleMiddleware.hasRole('admin'), controller.updateEmail.bind(controller));
router.put('/change-password', RoleMiddleware.hasRole('admin'), controller.updatePassword.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.deleteAdmin.bind(controller));


export default router;
