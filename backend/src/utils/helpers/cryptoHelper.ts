import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export class CryptoHelper {
  
  static async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);
    return { hash, salt };
  }
  
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
  
  static generateRandomToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }
  
  static generateSecureCode(length: number = 6): string {
    return crypto.randomInt(100000, 999999).toString();
  }
  
  static generateApiKey(): string {
    return `ck_${crypto.randomBytes(32).toString('hex')}`;
  }
  
  static encrypt(text: string, secret: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`;
  }
  
  static decrypt(encryptedText: string, secret: string): string {
    const [ivHex, encrypted, authTagHex] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
  
  static generateCSRFToken(): string {
    return crypto.randomBytes(32).toString('base64');
  }
  
  static hashString(input: string, algorithm: string = 'sha256'): string {
    return crypto.createHash(algorithm).update(input).digest('hex');
  }
  
  static generateUUID(): string {
    return crypto.randomUUID();
  }
}