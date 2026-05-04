import { Request, Response } from 'express';
import { AuthRequest } from '../../middleware/auth/jwtAuth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Simple UUID generator
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const users: any[] = [];

export const authController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, username, password, fullName } = req.body;
      if (users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User exists' });
      }
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = { id: generateUUID(), email, username, password: hashedPassword, fullName, role: 'user' };
      users.push(user);
      
      const token = jwt.sign(
        { id: user.id, email, username }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '7d' }
      );
      
      res.json({ 
        success: true, 
        data: { 
          user: { id: user.id, email, username, fullName, role: 'user' }, 
          accessToken: token 
        } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = users.find(u => u.email === email);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
      
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username }, 
        process.env.JWT_SECRET || 'secret', 
        { expiresIn: '7d' }
      );
      
      res.json({ 
        success: true, 
        data: { 
          user: { id: user.id, email: user.email, username: user.username, fullName: user.fullName, role: user.role }, 
          accessToken: token 
        } 
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  },

  logout: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, message: 'Logged out' });
  },

  refreshToken: async (req: Request, res: Response) => {
    res.json({ success: true, data: { accessToken: 'new_token', refreshToken: 'new_refresh' } });
  },

  verifyEmail: async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Email verified' });
  },

  resendVerification: async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Verification email sent' });
  },

  forgotPassword: async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Reset email sent' });
  },

  resetPassword: async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Password reset' });
  },

  googleAuth: async (req: Request, res: Response) => {
    res.json({ success: true, data: { user: { id: '1', email: 'google@user.com', username: 'google_user' }, accessToken: 'token' } });
  },

  changePassword: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, message: 'Password changed' });
  },

  getProfile: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { id: req.user?.id, email: req.user?.email, username: req.user?.username } });
  },

  updateProfile: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: { ...req.user, ...req.body } });
  },

  me: async (req: AuthRequest, res: Response) => {
    res.json({ success: true, data: req.user });
  },
};