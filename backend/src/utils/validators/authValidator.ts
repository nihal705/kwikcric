import { z } from 'zod';

export const registerValidator = z.object({
  email: z.string()
    .email('Invalid email format')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters'),
  username: z.string()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be less than 50 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be less than 100 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  fullName: z.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name must be less than 100 characters')
    .optional(),
  countryCode: z.string()
    .length(2, 'Country code must be 2 characters')
    .optional(),
});

export const loginValidator = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password required'),
});

export const changePasswordValidator = z.object({
  currentPassword: z.string().min(1, 'Current password required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const resetPasswordValidator = z.object({
  token: z.string().min(1, 'Reset token required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

export const forgotPasswordValidator = z.object({
  email: z.string().email('Invalid email format'),
});

export const resendVerificationValidator = z.object({
  email: z.string().email('Invalid email format'),
});

export const updateProfileValidator = z.object({
  fullName: z.string().min(2).max(100).optional(),
  countryCode: z.string().length(2).optional(),
  avatarUrl: z.string().url().optional(),
});