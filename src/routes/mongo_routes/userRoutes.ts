import { container } from "../../config/diContainer";
import express from 'express';
import { UserController } from '../../controller/userController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(UserController);

router.use(AuthMiddleware.verifyToken);


// User routes
router.get('/', RoleMiddleware.hasRole('user'), controller.getProfile.bind(controller));
router.put('/update', RoleMiddleware.hasRole('user'), controller.updateProfile.bind(controller));
router.put('/change-email', RoleMiddleware.hasRole('user'), controller.updateEmail.bind(controller));
router.put('/change-password', RoleMiddleware.hasRole('user'), controller.updatePassword.bind(controller));

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), controller.getAllUsers.bind(controller));
router.get('/:id', RoleMiddleware.hasRole('admin'), controller.getUserById.bind(controller));
router.put('/:id', RoleMiddleware.hasRole('admin'), controller.adminUpdateUser.bind(controller));
router.put('/:id/change-password', RoleMiddleware.hasRole('admin'), controller.adminUpdatePassword.bind(controller));
router.put('/:id/change-email', RoleMiddleware.hasRole('admin'), controller.adminUpdateEmail.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.deleteUser.bind(controller));

export default router;
