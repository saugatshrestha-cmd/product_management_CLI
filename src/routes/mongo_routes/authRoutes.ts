import express from 'express';
import { AuthController } from '../../controller/authController';

const router = express.Router();
const authController = new AuthController();

router.post('/login', async (req, res) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/logout', async (req, res) => {
  try {
    await authController.logout(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
