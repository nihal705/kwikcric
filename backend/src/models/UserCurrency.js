// backend/src/models/UserCurrency.js
const db = require('../config/database/postgres');

class UserCurrency {
  static async getOrCreate(userId) {
    let result = await db.query(
      'SELECT * FROM user_currency WHERE user_id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      result = await db.query(
        `INSERT INTO user_currency (user_id, gems, coins, total_gems_earned, total_coins_earned)
         VALUES ($1, 100, 500, 100, 500)
         RETURNING *`,
        [userId]
      );
    }
    
    return result.rows[0];
  }
  
  static async updateCurrency(userId, gemsDelta, coinsDelta) {
    const result = await db.query(
      `UPDATE user_currency 
       SET gems = gems + $1,
           coins = coins + $2,
           total_gems_earned = total_gems_earned + CASE WHEN $1 > 0 THEN $1 ELSE 0 END,
           total_coins_earned = total_coins_earned + CASE WHEN $2 > 0 THEN $2 ELSE 0 END,
           total_spent_gems = total_spent_gems + CASE WHEN $1 < 0 THEN ABS($1) ELSE 0 END,
           total_spent_coins = total_spent_coins + CASE WHEN $2 < 0 THEN ABS($2) ELSE 0 END,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $3
       RETURNING *`,
      [gemsDelta, coinsDelta, userId]
    );
    
    return result.rows[0];
  }
  
  // Get user currency
  static async getUserCurrency(userId) {
    const result = await db.query(
      'SELECT gems, coins FROM user_currency WHERE user_id = $1',
      [userId]
    );
    return result.rows[0] || { gems: 100, coins: 500 };
  }
}

module.exports = UserCurrency;