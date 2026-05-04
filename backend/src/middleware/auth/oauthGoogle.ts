// Google OAuth - Simplified version (no external dependencies)
import { logger } from '../../utils/logger';

export const googlePassport = {
  authenticate: () => {
    logger.warn('Google OAuth not configured');
    return (req: any, res: any, next: any) => next();
  }
};

logger.info('Google OAuth mock mode enabled');