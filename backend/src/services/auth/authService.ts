import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { query, transaction } from '../../config/database/postgres';
import { cacheSet, cacheGet, cacheDel } from '../../config/database/redis';
import { generateAccessToken, generateRefreshToken, revokeToken } from '../../middleware/auth/jwtAuth';
import { sendVerificationEmail, sendPasswordResetEmail } from './emailService';
import { logger } from '../../utils/logger';
import { AuthenticationError, ConflictError, NotFoundError } from '../../middleware/errorHandler';

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName?: string;
  countryCode?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  username: string;
  fullName: string | null;
  avatarUrl: string | null;
  countryCode: string | null;
  role: string;
  isVerified: boolean;
  createdAt: Date;
}

export class AuthService {
  
  async register(data: RegisterData): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    // Check if user exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 OR username = $2',
      [data.email, data.username]
    );
    
    if (existingUser.rows.length > 0) {
      throw new ConflictError('User with this email or username already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);
    
    // Create user in transaction
    const userResult = await transaction(async (client) => {
      const insertResult = await client.query(
        `INSERT INTO users (email, username, password_hash, salt, full_name, country_code, verification_token, verification_expires)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id, email, username, full_name, avatar_url, country_code, role, is_verified, created_at`,
        [
          data.email,
          data.username,
          passwordHash,
          salt,
          data.fullName || null,
          data.countryCode || null,
          verificationToken,
          verificationExpires,
        ]
      );
      
      return insertResult.rows[0];
    });
    
    // Send verification email
    await sendVerificationEmail(data.email, verificationToken).catch(err => {
      logger.error('Failed to send verification email:', err);
    });
    
    // Generate tokens
    const tokenPayload = {
      id: userResult.id,
      email: userResult.email,
      username: userResult.username,
      role: userResult.role,
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshTokenObj = generateRefreshToken(tokenPayload);
    
    // Store refresh token in Redis
    await cacheSet(`refresh:${userResult.id}`, refreshTokenObj, 7 * 24 * 3600);
    
    return {
      user: this.mapToUserResponse(userResult),
      accessToken,
      refreshToken: refreshTokenObj,
    };
  }
  
  async login(data: LoginData, ip?: string): Promise<{ user: UserResponse; accessToken: string; refreshToken: string }> {
    // Get user with password
    const dbResult = await query(
      `SELECT id, email, username, password_hash, full_name, avatar_url, country_code, role, is_verified, login_count
       FROM users WHERE email = $1`,
      [data.email]
    );
    
    if (dbResult.rows.length === 0) {
      throw new AuthenticationError('Invalid email or password');
    }
    
    const user = dbResult.rows[0];
    
    // Check if banned
    const bannedCheck = await query(
      'SELECT is_banned, ban_reason FROM users WHERE id = $1 AND is_banned = true',
      [user.id]
    );
    if (bannedCheck.rows.length > 0) {
      throw new AuthenticationError('Account has been banned. Contact support.');
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password_hash);
    if (!isValidPassword) {
      await query(
        'UPDATE users SET login_count = login_count + 1 WHERE id = $1',
        [user.id]
      );
      throw new AuthenticationError('Invalid email or password');
    }
    
    // Update last login
    await query(
      `UPDATE users 
       SET last_login_at = NOW(), last_login_ip = $1, login_count = 0 
       WHERE id = $2`,
      [ip || null, user.id]
    );
    
    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshTokenObj = generateRefreshToken(tokenPayload);
    
    // Store refresh token
    await cacheSet(`refresh:${user.id}`, refreshTokenObj, 7 * 24 * 3600);
    
    return {
      user: this.mapToUserResponse(user),
      accessToken,
      refreshToken: refreshTokenObj,
    };
  }
  
  async logout(userId: string, accessToken: string): Promise<void> {
    await cacheDel(`refresh:${userId}`);
    await cacheSet(`blacklist:${accessToken}`, true, 15 * 60);
    logger.info(`User ${userId} logged out`);
  }
  
  async refreshToken(userId: string, refreshTokenValue: string): Promise<{ accessToken: string; refreshToken: string }> {
    const storedRefreshToken = await cacheGet(`refresh:${userId}`);
    if (!storedRefreshToken || storedRefreshToken !== refreshTokenValue) {
      throw new AuthenticationError('Invalid refresh token');
    }
    
    const userResult = await query(
      'SELECT id, email, username, role FROM users WHERE id = $1 AND is_active = true',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new AuthenticationError('User not found');
    }
    
    const user = userResult.rows[0];
    
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
    
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    
    await cacheSet(`refresh:${user.id}`, newRefreshToken, 7 * 24 * 3600);
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
  
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    const userResult = await query(
      `SELECT id FROM users 
       WHERE verification_token = $1 AND verification_expires > NOW() AND is_verified = false`,
      [token]
    );
    
    if (userResult.rows.length === 0) {
      return { success: false, message: 'Invalid or expired verification token' };
    }
    
    await query(
      `UPDATE users 
       SET is_verified = true, verification_token = NULL, verification_expires = NULL 
       WHERE id = $1`,
      [userResult.rows[0].id]
    );
    
    return { success: true, message: 'Email verified successfully' };
  }
  
  async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
    const userResult = await query(
      'SELECT id, is_verified FROM users WHERE email = $1',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return { success: false, message: 'User not found' };
    }
    
    const user = userResult.rows[0];
    
    if (user.is_verified) {
      return { success: false, message: 'Email already verified' };
    }
    
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date();
    verificationExpires.setHours(verificationExpires.getHours() + 24);
    
    await query(
      `UPDATE users 
       SET verification_token = $1, verification_expires = $2 
       WHERE id = $3`,
      [verificationToken, verificationExpires, user.id]
    );
    
    await sendVerificationEmail(email, verificationToken);
    
    return { success: true, message: 'Verification email sent' };
  }
  
  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const userResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return { success: true, message: 'If the email exists, a reset link will be sent' };
    }
    
    const user = userResult.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date();
    resetExpires.setHours(resetExpires.getHours() + 1);
    
    await query(
      `UPDATE users 
       SET reset_token = $1, reset_expires = $2 
       WHERE id = $3`,
      [resetToken, resetExpires, user.id]
    );
    
    await sendPasswordResetEmail(email, resetToken);
    
    return { success: true, message: 'If the email exists, a reset link will be sent' };
  }
  
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const userResult = await query(
      `SELECT id FROM users 
       WHERE reset_token = $1 AND reset_expires > NOW()`,
      [token]
    );
    
    if (userResult.rows.length === 0) {
      return { success: false, message: 'Invalid or expired reset token' };
    }
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await query(
      `UPDATE users 
       SET password_hash = $1, salt = $2, reset_token = NULL, reset_expires = NULL 
       WHERE id = $3`,
      [passwordHash, salt, userResult.rows[0].id]
    );
    
    await cacheDel(`refresh:${userResult.rows[0].id}`);
    
    return { success: true, message: 'Password reset successfully' };
  }
  
  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const userResult = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new NotFoundError('User');
    }
    
    const isValid = await bcrypt.compare(currentPassword, userResult.rows[0].password_hash);
    if (!isValid) {
      throw new AuthenticationError('Current password is incorrect');
    }
    
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);
    
    await query(
      'UPDATE users SET password_hash = $1, salt = $2 WHERE id = $3',
      [passwordHash, salt, userId]
    );
    
    await cacheDel(`refresh:${userId}`);
  }
  
  async getUserProfile(userId: string): Promise<UserResponse> {
    const userResult = await query(
      `SELECT id, email, username, full_name, avatar_url, country_code, role, is_verified, created_at, last_login_at
       FROM users WHERE id = $1`,
      [userId]
    );
    
    if (userResult.rows.length === 0) {
      throw new NotFoundError('User');
    }
    
    return this.mapToUserResponse(userResult.rows[0]);
  }
  
  async updateUserProfile(userId: string, updates: { fullName?: string; countryCode?: string; avatarUrl?: string }): Promise<UserResponse> {
    const allowedFields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (updates.fullName !== undefined) {
      allowedFields.push(`full_name = $${paramIndex++}`);
      values.push(updates.fullName);
    }
    if (updates.countryCode !== undefined) {
      allowedFields.push(`country_code = $${paramIndex++}`);
      values.push(updates.countryCode);
    }
    if (updates.avatarUrl !== undefined) {
      allowedFields.push(`avatar_url = $${paramIndex++}`);
      values.push(updates.avatarUrl);
    }
    
    if (allowedFields.length === 0) {
      return this.getUserProfile(userId);
    }
    
    values.push(userId);
    const result = await query(
      `UPDATE users SET ${allowedFields.join(', ')} WHERE id = $${paramIndex}
       RETURNING id, email, username, full_name, avatar_url, country_code, role, is_verified, created_at`,
      values
    );
    
    return this.mapToUserResponse(result.rows[0]);
  }
  
  private mapToUserResponse(dbUser: any): UserResponse {
    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      fullName: dbUser.full_name || null,
      avatarUrl: dbUser.avatar_url || null,
      countryCode: dbUser.country_code || null,
      role: dbUser.role,
      isVerified: dbUser.is_verified,
      createdAt: dbUser.created_at,
    };
  }
}

export const authService = new AuthService();