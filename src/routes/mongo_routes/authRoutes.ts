// src/auth/AuthRoutes.ts
import express from 'express';
import { AuthController } from '../../controller/authController';

const router = express.Router();
const controller = new AuthController();

router.post('/login', async (req, res) => {
  try {
    await controller.login(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    await controller.register(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
