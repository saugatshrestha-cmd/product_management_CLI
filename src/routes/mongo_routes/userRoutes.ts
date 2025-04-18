import express, { Request, Response } from 'express';
import { UserService } from '../../services/userService';

const router = express.Router();
const userService = new UserService();

// Get all users
router.get('/', async (req: Request, res: Response) => {
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

// Delete a user
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    const result = await userService.deleteUser(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
