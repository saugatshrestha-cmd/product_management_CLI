import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@services/authService';
import { injectable, inject } from "tsyringe";
import { handleSuccess, handleError } from '@utils/apiResponse';
import { logger } from '@utils/logger';
import { AppError } from '@utils/errorHandler';

@injectable()
export class AuthController {

  constructor(
              @inject("AuthService") private authService: AuthService
          ) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;

    try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
      const result = await this.authService.login(email, password);

      if (!result.token) {
        logger.warn('Failed login attempt', { email });
        res.status(401).json({ message: result.message });
        return;
      }

      logger.info('User logged in successfully', { email });
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 3600000,
      });

      

      handleSuccess(res, { 
        message: result.message,
        token: result.token
      });
    } catch (error) {
      handleError(next, error);
    }
  };

  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.authService.register(req.body);

      if (!result.user) {
        logger.warn('Registration failed', {
          status: 'failed',
          type: 'registration'
        });
        throw AppError.badRequest(result.message);
      }

      logger.info('User registered successfully');

      handleSuccess(res, { message: result.message });
    } catch (error) {
      handleError(next, error);
    }
  };

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.cookies?.token;

      if (!token) {
        logger.warn('Logout attempt with no active session');
        throw AppError.badRequest('No active session to logout');
      }
      
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      logger.info('User logged out successfully');

      handleSuccess(res, { message: 'Logged out successfully' });
    } catch (error) {
      handleError(next, error);
    }
  }
}
