import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthRequest } from '../types/authTypes';

export class AuthMiddleware {
  static verifyToken(req: AuthRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload; 
      req.user = {
        _id: decoded._id,
        role: decoded.role
      };
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid or expired token.' });
    }
  }
}
