import { container } from "@config/diContainer";
import express from 'express';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { CategoryController } from '@controller/categoryController';
import { Validator } from "@middleware/validationMiddleware";
import { createCategorySchema, updateCategorySchema } from "@validation/categoryValidation";

const router = express.Router();
const controller = container.resolve(CategoryController);

router.use(AuthMiddleware.verifyToken);
router.use(RoleMiddleware.hasRole('admin'));

router.get('/', controller.getAllCategories.bind(controller));
router.get('/:id', controller.getCategoryById.bind(controller));
router.post('/', new Validator(createCategorySchema).validate(), controller.createCategory.bind(controller));
router.put('/:id', new Validator(updateCategorySchema).validate(), controller.updateCategory.bind(controller));
router.delete('/:id', controller.deleteCategory.bind(controller));

export default router;
