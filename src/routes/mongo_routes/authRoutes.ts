import { container } from "@config/diContainer";
import express from 'express';
import { AuthController } from '@controller/authController';
import { Validator } from '@middleware/validationMiddleware';
import { createUserSchema } from "@validation/userValidation";

const router = express.Router();
const controller = container.resolve(AuthController);

router.post('/login', controller.login.bind(controller));

router.post('/register', new Validator(createUserSchema).validate(), controller.register.bind(controller));

router.post('/logout', controller.logout.bind(controller));

export default router;
