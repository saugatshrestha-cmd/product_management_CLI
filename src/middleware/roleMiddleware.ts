import { Request, Response, NextFunction } from 'express';

export class RoleMiddleware {
  static isAdmin(req: Request, res: Response, next: NextFunction): void {
    const loggedInUser = (req as any).user;
    if (loggedInUser.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admins only.' });
      return;
    }
    next();
  }

  static isUser(req: Request, res: Response, next: NextFunction): void {
    const loggedInUser = (req as any).user;
    if (loggedInUser.role !== 'user') {
      res.status(403).json({ message: 'Access denied. Users only.' });
      return;
    }
    next();
  }
}
