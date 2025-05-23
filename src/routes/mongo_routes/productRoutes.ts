import { container } from "@config/diContainer";
import express from 'express';
import { ProductController } from '@controller/productController';
import { AuthMiddleware } from '@middleware/authMiddleware';
import { RoleMiddleware } from '@middleware/roleMiddleware';
import { Validator } from "@middleware/validationMiddleware";
import { createProductSchema, updateProductSchema } from "@validation/productValidation";
import { validateImage } from "@middleware/fileMiddleware";
import multer from 'multer';
const upload = multer();

const router = express.Router();
const controller = container.resolve(ProductController);

router.use(AuthMiddleware.verifyToken);

router.get('/seller', RoleMiddleware.hasRole('seller'), controller.getProductBySeller.bind(controller));
router.post('/', new Validator(createProductSchema).validate(), RoleMiddleware.hasRole('seller'), upload.array('images', 5), validateImage, controller.createProduct.bind(controller));
router.put('/seller/:id', RoleMiddleware.hasRole('seller'), new Validator(updateProductSchema).validate(), upload.array('newFiles', 5), validateImage, controller.updateProduct.bind(controller));
router.delete('/delete/:id', RoleMiddleware.hasRole('seller'), controller.deleteProduct.bind(controller));

router.get('/', RoleMiddleware.hasRole('admin'), controller.getAllProducts.bind(controller));
router.get('/:id', RoleMiddleware.hasRole('admin'), controller.getProductById.bind(controller));
router.put('/:id', RoleMiddleware.hasRole('admin'), new Validator(updateProductSchema).validate(), controller.adminUpdateProduct.bind(controller));
router.delete('/:id', RoleMiddleware.hasRole('admin'), controller.adminDeleteProduct.bind(controller));

export default router;
