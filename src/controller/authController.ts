// src/auth/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.authService.login(email, password);

    if (!result.user) {
      return res.status(401).json({ message: result.message });
    }

    res.status(200).json({
      message: result.message,
      token: result.token,
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email
      }
    });
  };

  register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);

    if (!result.user) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json({
      message: result.message,
      token: result.token,
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email
      }
    });
  };
}
