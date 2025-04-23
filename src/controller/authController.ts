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

    if (!result.token) {
      return res.status(401).json({ message: result.message });
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

  register = async (req: Request, res: Response) => {
    const result = await this.authService.register(req.body);

    if (!result.user) {
      return res.status(400).json({ message: result.message });
    }

    res.status(201).json({
      message: result.message
    });
  };

  logout = async (req: Request, res: Response) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  };
}
