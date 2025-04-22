import express, { Request, Response } from 'express';
import { UserService } from '../../services/userService';
import { AuthMiddleware } from '../../middleware/authMiddleware';
import { RoleMiddleware } from '../../middleware/roleMiddleware';
import { UserModel } from '../../models/userModel';

const router = express.Router();
const userService = new UserService();

// Get all users
router.get('/', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching1' });
  }
});

router.get("/profile", AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUser = (req as any).user;
    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No id in token" });
      return;
    }

    const user = await UserModel.findOne({ id: loggedInUser.id }).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return; 
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.put("/profile/update", AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUser = (req as any).user;
    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const updatedInfo = req.body;

    const result = await userService.updateUser(loggedInUser.id, updatedInfo);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.put("/profile/change-email", AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUser = (req as any).user;
    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const newEmail = req.body;

    const result = await userService.updateEmail(loggedInUser.id, newEmail);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.put("/profile/change-password", AuthMiddleware.verifyToken, RoleMiddleware.isUser, async (req: Request, res: Response): Promise<void> => {
  try {
    const loggedInUser = (req as any).user;
    if (!loggedInUser?._id) {
      res.status(400).json({ message: "No userId in token" });
      return;
    }

    const newPassword = req.body;

    const result = await userService.updatePassword(loggedInUser.id, newPassword);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.get('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await userService.getUserById(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching2' });
  }
});

router.put('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updatedInfo = req.body;
    const result = await userService.updateUser(userId, updatedInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.put('/:id/change-password', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const newPassword = req.body;

    const result = await userService.updatePassword(userId, newPassword);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

router.put('/:id/change-email', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const newEmail = req.body;

    const result = await userService.updateEmail(userId, newEmail);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
});

router.delete('/:id', AuthMiddleware.verifyToken, RoleMiddleware.isAdmin, async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await userService.deleteUser(userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;
