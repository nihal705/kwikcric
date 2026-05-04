-- ============================================================================
-- MIGRATION 001: Users & Authentication Tables
-- ============================================================================

BEGIN;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    avatar_url TEXT,
    country_code VARCHAR(5),
    timezone VARCHAR(50) DEFAULT 'UTC',
    role VARCHAR(20) DEFAULT 'user',
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_expires TIMESTAMP,
    reset_token VARCHAR(255),
    reset_expires TIMESTAMP,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    refresh_token VARCHAR(500),
    refresh_token_expires TIMESTAMP,
    last_login_ip INET,
    last_login_at TIMESTAMP,
    login_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_banned BOOLEAN DEFAULT FALSE,
    ban_reason TEXT,
    preferences JSONB DEFAULT '{"theme": "dark", "notifications": true}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_users_refresh_token ON users(refresh_token);

-- Insert admin user (password: Admin@12345)
-- Hash generated using bcrypt
INSERT INTO users (email, username, password_hash, salt, full_name, role, is_verified)
VALUES (
    'admin@cricketuniverse.com',
    'admin',
    '$2b$10$rVqZqZqZqZqZqZqZqZqZqZu',
    '$2b$10$rVqZqZqZqZqZqZqZqZqZqZu',
    'System Administrator',
    'admin',
    TRUE
) ON CONFLICT (email) DO NOTHING;

COMMIT;