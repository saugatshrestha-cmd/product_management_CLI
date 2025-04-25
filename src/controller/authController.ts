import { Request, Response } from 'express';
import { AuthService } from '@services/authService';
import { injectable, inject } from "tsyringe";

@injectable()
export class AuthController {

  constructor(
              @inject("AuthService") private authService: AuthService
          ) {}

  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    const result = await this.authService.login(email, password);

    if (!result.token) {
      res.status(401).json({ message: result.message });
      return;
    }

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.status(200).json({ 
      message: result.message,
      token: result.token
    });
  };

  async register(req: Request, res: Response): Promise<void> {
    const result = await this.authService.register(req.body);

    if (!result.user) {
      res.status(400).json({ message: result.message });
      return;
    }

    res.status(201).json({
      message: result.message
    });
  };

  async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };
}
