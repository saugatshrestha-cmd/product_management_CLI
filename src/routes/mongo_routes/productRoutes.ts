import { container } from "@config/diContainer";
import express from 'express';
import { ProductController } from '@controller/productController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';

const router = express.Router();
const controller = container.resolve(ProductController);

router.use(AuthMiddleware.verifyToken);

router.get('/seller', RoleMiddleware.hasRole('seller'), controller.getProductBySeller.bind(controller));
router.post('/', RoleMiddleware.hasRole('seller'), controller.createProduct.bind(controller));
router.put('/seller', RoleMiddleware.hasRole('seller'), controller.updateProduct.bind(controller));

router.get('/', RoleMiddleware.hasRole('admin'), controller.getAllProducts.bind(controller));
router.get('/:id', RoleMiddleware.hasRole('admin'), controller.getProductById.bind(controller));
router.put('/:id', RoleMiddleware.hasRole('admin'), controller.adminUpdateProduct.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.adminDeleteProduct.bind(controller));

export default router;
