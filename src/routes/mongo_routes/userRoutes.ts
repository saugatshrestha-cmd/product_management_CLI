import express, { Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';

const router = express.Router();
const userService = new UserService();

// Get all users
router.get('/', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = await userService.getUserById(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update a user
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const updatedInfo = req.body;
    const result = await userService.updateUser(userId, updatedInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.put('/:id/change-password', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const newPassword = req.body;

    const result = await userService.updatePassword(userId, newPassword);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

router.put('/:id/change-email', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const newEmail = req.body;

    const result = await userService.updatePassword(userId, newEmail);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

// Delete a user
router.delete('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = await userService.deleteUser(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
