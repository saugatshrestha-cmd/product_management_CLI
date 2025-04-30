import { Request, Response, NextFunction } from 'express';

export class RoleMiddleware {
  static hasRole(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const loggedInUser = (req as any).user;
      if (!allowedRoles.includes(loggedInUser?.role)) {
        res.status(403).json({ message: 'Access denied ' });
        return;
      }
      next();
    };
  }
}
