import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
  token?: string;
}

export const jwtAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    
    req.user = { id: decoded.id, email: decoded.email, username: decoded.username, role: decoded.role || 'user' };
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const generateAccessToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};

export const revokeToken = async (token: string): Promise<void> => {
  // Implementation for token revocation
  console.log('Token revoked:', token);
};