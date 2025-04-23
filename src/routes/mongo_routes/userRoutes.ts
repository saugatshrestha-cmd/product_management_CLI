import express from 'express';
import { UserController } from '../../controller/userController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);


// User routes
router.get('/my', RoleMiddleware.hasRole('user'), UserController.getProfile);
router.put('/update', RoleMiddleware.hasRole('user'), UserController.updateProfile);
router.put('/change-email', RoleMiddleware.hasRole('user'), UserController.updateEmail);
router.put('/change-password', RoleMiddleware.hasRole('user'), UserController.updatePassword);

// Admin routes
router.get('/', RoleMiddleware.hasRole('admin'), UserController.getAllUsers);
router.get('/:id', RoleMiddleware.hasRole('admin'), UserController.getUserById);
router.put('/:id', RoleMiddleware.hasRole('admin'), UserController.adminUpdateUser);
router.put('/:id/change-password', RoleMiddleware.hasRole('admin'), UserController.adminUpdatePassword);
router.put('/:id/change-email', RoleMiddleware.hasRole('admin'), UserController.adminUpdateEmail);
router.delete('/:id', RoleMiddleware.hasRole('admin'), UserController.deleteUser);

export default router;
