import express from 'express';
import { UserService } from '../../services/userService';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';
import { Role } from '../../types/enumTypes';

const router = express.Router();
const userService = new UserService();

router.post('/create-admin', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req, res) => {
  const { firstName, lastName, email, password, phone, address } = req.body;
  const result = await userService.createAdmin({
    firstName, lastName, email, password, phone, address, role: Role.ADMIN
  });
  res.status(201).json(result);
});


export default router;
