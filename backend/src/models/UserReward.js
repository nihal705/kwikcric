// backend/src/models/UserReward.js
const db = require('../config/database/postgres.ts');

class UserReward {
  // Check if a reward was already claimed (for one-time or daily)
  static async isClaimed(userId, gameName, achievementKey, period = null) {
    let query = `
      SELECT * FROM user_rewards 
      WHERE user_id = $1 AND game_name = $2 AND achievement_key = $3
    `;
    const params = [userId, gameName, achievementKey];
    
    if (period === 'daily') {
      query += ` AND last_claimed_at::DATE = CURRENT_DATE`;
    }
    
    const result = await db.query(query, params);
    return result.rows.length > 0;
  }

  // Get claim count for an achievement
  static async getClaimCount(userId, gameName, achievementKey) {
    const result = await db.query(
      `SELECT claim_count, last_claimed_at FROM user_rewards 
       WHERE user_id = $1 AND game_name = $2 AND achievement_key = $3`,
      [userId, gameName, achievementKey]
    );
    return result.rows[0] || { claim_count: 0, last_claimed_at: null };
  }

  // Save a reward claim
  static async saveReward(userId, gameName, achievementKey, coins, gems) {
    // Check if exists
    const existing = await db.query(
      `SELECT id, claim_count FROM user_rewards 
       WHERE user_id = $1 AND game_name = $2 AND achievement_key = $3`,
      [userId, gameName, achievementKey]
    );
    
    if (existing.rows.length > 0) {
      // Update existing
      const result = await db.query(
        `UPDATE user_rewards 
         SET claim_count = claim_count + 1, 
             reward_coins = reward_coins + $4,
             reward_gems = reward_gems + $5,
             last_claimed_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [existing.rows[0].id, coins, gems]
      );
      return result.rows[0];
    } else {
      // Insert new
      const result = await db.query(
        `INSERT INTO user_rewards (user_id, game_name, achievement_key, reward_coins, reward_gems, claim_count)
         VALUES ($1, $2, $3, $4, $5, 1)
         RETURNING *`,
        [userId, gameName, achievementKey, coins, gems]
      );
      return result.rows[0];
    }
  }

  // Get user's total rewards summary
  static async getUserRewardsSummary(userId) {
    const result = await db.query(
      `SELECT 
        SUM(reward_coins) as total_coins,
        SUM(reward_gems) as total_gems,
        COUNT(*) as total_achievements
       FROM user_rewards 
       WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || { total_coins: 0, total_gems: 0, total_achievements: 0 };
  }

  // Get today's claimed rewards
  static async getTodayClaimedRewards(userId) {
    const result = await db.query(
      `SELECT game_name, achievement_key, reward_coins, reward_gems
       FROM user_rewards 
       WHERE user_id = $1 AND last_claimed_at::DATE = CURRENT_DATE`,
      [userId]
    );
    return result.rows;
  }
}

module.exports = UserReward;