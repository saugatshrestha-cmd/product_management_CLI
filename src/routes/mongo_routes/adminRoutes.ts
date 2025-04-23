import express from 'express';
import { AdminController } from '../../controller/adminController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);


router.get('/my', RoleMiddleware.hasRole('admin'), AdminController.getProfile);
router.post('/', RoleMiddleware.hasRole('admin'), AdminController.createAdmin);
router.put('/update', RoleMiddleware.hasRole('admin'), AdminController.updateProfile);
router.put('/change-email', RoleMiddleware.hasRole('admin'), AdminController.updateEmail);
router.put('/change-password', RoleMiddleware.hasRole('admin'), AdminController.updatePassword);
router.delete('/:id', RoleMiddleware.hasRole('admin'), AdminController.deleteAdmin);


export default router;
