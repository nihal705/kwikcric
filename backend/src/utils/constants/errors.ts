export const ErrorCodes = {
  // Auth errors (1000-1099)
  AUTH_REQUIRED: 'AUTH_001',
  INVALID_CREDENTIALS: 'AUTH_002',
  TOKEN_EXPIRED: 'AUTH_003',
  TOKEN_INVALID: 'AUTH_004',
  USER_NOT_FOUND: 'AUTH_005',
  USER_ALREADY_EXISTS: 'AUTH_006',
  EMAIL_NOT_VERIFIED: 'AUTH_007',
  ACCOUNT_BANNED: 'AUTH_008',
  INVALID_REFRESH_TOKEN: 'AUTH_009',
  
  // Validation errors (2000-2099)
  VALIDATION_FAILED: 'VAL_001',
  MISSING_FIELD: 'VAL_002',
  INVALID_FORMAT: 'VAL_003',
  
  // Resource errors (3000-3099)
  RESOURCE_NOT_FOUND: 'RES_001',
  RESOURCE_ALREADY_EXISTS: 'RES_002',
  RESOURCE_LOCKED: 'RES_003',
  
  // Permission errors (4000-4099)
  FORBIDDEN: 'PERM_001',
  INSUFFICIENT_PERMISSIONS: 'PERM_002',
  
  // Rate limit errors (5000-5099)
  RATE_LIMIT_EXCEEDED: 'RATE_001',
  
  // Server errors (9000-9099)
  INTERNAL_ERROR: 'SRV_001',
  DATABASE_ERROR: 'SRV_002',
  CACHE_ERROR: 'SRV_003',
  EXTERNAL_API_ERROR: 'SRV_004',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCodes.AUTH_REQUIRED]: 'Authentication required',
  [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid email or password',
  [ErrorCodes.TOKEN_EXPIRED]: 'Token has expired',
  [ErrorCodes.TOKEN_INVALID]: 'Invalid token',
  [ErrorCodes.USER_NOT_FOUND]: 'User not found',
  [ErrorCodes.USER_ALREADY_EXISTS]: 'User already exists',
  [ErrorCodes.EMAIL_NOT_VERIFIED]: 'Email not verified',
  [ErrorCodes.ACCOUNT_BANNED]: 'Account has been banned',
  [ErrorCodes.INVALID_REFRESH_TOKEN]: 'Invalid refresh token',
  [ErrorCodes.VALIDATION_FAILED]: 'Validation failed',
  [ErrorCodes.MISSING_FIELD]: 'Missing required field',
  [ErrorCodes.INVALID_FORMAT]: 'Invalid format',
  [ErrorCodes.RESOURCE_NOT_FOUND]: 'Resource not found',
  [ErrorCodes.RESOURCE_ALREADY_EXISTS]: 'Resource already exists',
  [ErrorCodes.RESOURCE_LOCKED]: 'Resource is locked',
  [ErrorCodes.FORBIDDEN]: 'Access forbidden',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'Insufficient permissions',
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Rate limit exceeded',
  [ErrorCodes.INTERNAL_ERROR]: 'Internal server error',
  [ErrorCodes.DATABASE_ERROR]: 'Database error',
  [ErrorCodes.CACHE_ERROR]: 'Cache error',
  [ErrorCodes.EXTERNAL_API_ERROR]: 'External API error',
};