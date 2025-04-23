import express from 'express';
import { ProductController } from '../../controller/productController';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();

router.use(AuthMiddleware.verifyToken);

router.get('/seller', RoleMiddleware.hasRole('seller'), ProductController.getProductBySeller);
router.post('/', RoleMiddleware.hasRole('seller'), ProductController.createProduct);
router.put('/seller', RoleMiddleware.hasRole('seller'), ProductController.updateProduct);

router.get('/', RoleMiddleware.hasRole('admin'), ProductController.getAllProducts);
router.get('/:id', RoleMiddleware.hasRole('admin'), ProductController.getProductById);
router.put('/:id', RoleMiddleware.hasRole('admin'), ProductController.adminUpdateProduct);
router.delete('/:id', RoleMiddleware.hasRole('admin'), ProductController.adminDeleteProduct);

export default router;
