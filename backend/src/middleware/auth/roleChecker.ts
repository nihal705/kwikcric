import { Response, NextFunction } from 'express';
import { AuthRequest } from './jwtAuth';

export const requireRole = (allowedRoles: string | string[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    
    if (roles.includes(req.user.role) || req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Insufficient permissions' });
    }
  };
};