import axios from 'axios';
import { query, transaction } from '../../config/database/postgres';
import { generateAccessToken, generateRefreshToken } from '../../middleware/auth/jwtAuth';
import { cacheSet } from '../../config/database/redis';
import { logger } from '../../utils/logger';
import { ConflictError } from '../../middleware/errorHandler';

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export class OAuthService {
  
  async verifyGoogleToken(token: string): Promise<GoogleUserInfo | null> {
    try {
      const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      logger.error('Google token verification failed:', error);
      return null;
    }
  }
  
  async handleGoogleLogin(googleToken: string, ip?: string): Promise<{
    user: any;
    accessToken: string;
    refreshToken: string;
    isNewUser: boolean;
  }> {
    const googleUser = await this.verifyGoogleToken(googleToken);
    
    if (!googleUser || !googleUser.email) {
      throw new Error('Invalid Google token');
    }
    
    // Check if user exists
    const existingUser = await query(
      'SELECT id, email, username, full_name, avatar_url, role, is_verified FROM users WHERE email = $1',
      [googleUser.email]
    );
    
    if (existingUser.rows.length > 0) {
      // Update last login
      await query(
        `UPDATE users 
         SET last_login_at = NOW(), last_login_ip = $1 
         WHERE id = $2`,
        [ip || null, existingUser.rows[0].id]
      );
      
      const user = existingUser.rows[0];
      const tokenPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      };
      
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);
      
      await cacheSet(`refresh:${user.id}`, refreshToken, 7 * 24 * 3600);
      
      return {
        user: this.mapToUserResponse(user),
        accessToken,
        refreshToken,
        isNewUser: false,
      };
    }
    
    // Create new user
    const username = this.generateUsername(googleUser.email);
    
    const result = await transaction(async (client) => {
      const insertResult = await client.query(
        `INSERT INTO users (email, username, full_name, avatar_url, is_verified, last_login_at, last_login_ip)
         VALUES ($1, $2, $3, $4, $5, NOW(), $6)
         RETURNING id, email, username, full_name, avatar_url, role, is_verified, created_at`,
        [
          googleUser.email,
          username,
          googleUser.name || null,
          googleUser.picture || null,
          googleUser.verified_email || true,
          ip || null,
        ]
      );
      
      return insertResult.rows[0];
    });
    
    const tokenPayload = {
      id: result.id,
      email: result.email,
      username: result.username,
      role: result.role,
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    await cacheSet(`refresh:${result.id}`, refreshToken, 7 * 24 * 3600);
    
    return {
      user: this.mapToUserResponse(result),
      accessToken,
      refreshToken,
      isNewUser: true,
    };
  }
  
  private generateUsername(email: string): string {
    const base = email.split('@')[0].toLowerCase();
    // Remove invalid characters
    const cleaned = base.replace(/[^a-z0-9]/g, '');
    const random = Math.random().toString(36).substring(2, 8);
    return `${cleaned}${random}`;
  }
  
  private mapToUserResponse(dbUser: any): any {
    return {
      id: dbUser.id,
      email: dbUser.email,
      username: dbUser.username,
      fullName: dbUser.full_name || null,
      avatarUrl: dbUser.avatar_url || null,
      role: dbUser.role,
      isVerified: dbUser.is_verified,
      createdAt: dbUser.created_at,
    };
  }
}

export const oauthService = new OAuthService();