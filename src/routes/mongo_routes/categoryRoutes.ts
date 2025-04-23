import express from 'express';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';
import { CategoryController } from '../../controller/categoryController';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.hasRole('admin'));

router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.post('/', CategoryController.createCategory);
router.put('/:id', CategoryController.updateCategory);
router.delete('/:id', CategoryController.deleteCategory);

export default router;
