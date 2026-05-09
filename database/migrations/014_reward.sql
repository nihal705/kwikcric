-- User rewards tracking table
CREATE TABLE IF NOT EXISTS user_rewards (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  game_name VARCHAR(50) NOT NULL,
  achievement_key VARCHAR(100) NOT NULL,
  reward_coins INTEGER DEFAULT 0,
  reward_gems INTEGER DEFAULT 0,
  claim_count INTEGER DEFAULT 1,
  last_claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, game_name, achievement_key)
);

-- Create index for faster queries
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_last_claimed ON user_rewards(last_claimed_at);

-- Update user_currency table if not exists
CREATE TABLE IF NOT EXISTS user_currency (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  gems INTEGER DEFAULT 100,
  coins INTEGER DEFAULT 500,
  total_gems_earned INTEGER DEFAULT 100,
  total_coins_earned INTEGER DEFAULT 500,
  total_spent_gems INTEGER DEFAULT 0,
  total_spent_coins INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_daily_claims table
CREATE TABLE IF NOT EXISTS user_daily_claims (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  claim_key VARCHAR(100) NOT NULL,
  last_claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, claim_key)
);