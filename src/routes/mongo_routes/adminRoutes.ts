import express from 'express';
import { UserService } from '../../services/userService';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();
const userService = new UserService();

router.post('/', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req, res) => {
  const adminId = req.body;
  const result = await userService.createAdmin(adminId);
  res.status(201).json(result);
});


export default router;
