// backend/src/api/rewards.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const db = require('../config/database/postgres');

// Helper function to get or create user currency
async function getOrCreateCurrency(userId) {
  // Check if currency exists
  const result = await db.query(
    'SELECT gems, coins FROM user_currency WHERE user_id = $1',
    [userId]
  );
  
  if (result.rows.length === 0) {
    // Create default currency
    await db.query(
      `INSERT INTO user_currency (user_id, gems, coins, total_gems_earned, total_coins_earned)
       VALUES ($1, 100, 500, 100, 500)`,
      [userId]
    );
    return { gems: 100, coins: 500 };
  }
  
  return result.rows[0];
}

// Helper function to update currency
async function updateCurrency(userId, gemsDelta, coinsDelta) {
  const result = await db.query(
    `UPDATE user_currency 
     SET gems = gems + $1,
         coins = coins + $2,
         total_gems_earned = total_gems_earned + CASE WHEN $1 > 0 THEN $1 ELSE 0 END,
         total_coins_earned = total_coins_earned + CASE WHEN $2 > 0 THEN $2 ELSE 0 END,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = $3
     RETURNING *`,
    [gemsDelta, coinsDelta, userId]
  );
  return result.rows[0];
}

// Get user currency
router.get('/currency', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currency = await getOrCreateCurrency(userId);
    res.json(currency);
  } catch (error) {
    console.error('Error getting currency:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Claim repeatable reward
router.post('/claim/repeatable', verifyToken, async (req, res) => {
  try {
    const { game, achievement, progress } = req.body;
    const userId = req.user.userId;
    
    // Define rewards based on game and achievement
    const rewards = {
      'kwik-cricket': {
        'runs_10': { coins: 10, gems: 0 },
        'runs_50': { coins: 50, gems: 1 },
        'runs_100': { coins: 150, gems: 3 },
        'wicket_1': { coins: 15, gems: 0 },
        'wicket_3': { coins: 60, gems: 1 },
        'wicket_5': { coins: 150, gems: 3 },
        'match_win': { coins: 100, gems: 2 },
        'tournament_win': { coins: 500, gems: 10 },
      },
      'cricket-mastermind': {
        'correct_answer': { coins: 5, gems: 0 },
        'perfect_round': { coins: 200, gems: 5 },
        'streak_10': { coins: 100, gems: 2 },
      },
      'imposter': {
        'win_real': { coins: 75, gems: 2 },
        'win_imposter': { coins: 150, gems: 5 },
        'catch_imposter': { coins: 50, gems: 1 },
        'survive_imposter': { coins: 100, gems: 3 },
      },
      'guess-legend': {
        'correct_guess': { coins: 10, gems: 0 },
        'streak_5': { coins: 75, gems: 1 },
        'fast_guess': { coins: 50, gems: 1 },
      }
    };
    
    const reward = rewards[game]?.[achievement];
    if (!reward) {
      return res.status(400).json({ success: false, error: 'Invalid achievement' });
    }
    
    const totalCoins = reward.coins * (progress || 1);
    const totalGems = reward.gems * (progress || 1);
    
    // Update user currency
    await getOrCreateCurrency(userId);
    await updateCurrency(userId, totalGems, totalCoins);
    
    res.json({
      success: true,
      reward: {
        coins: totalCoins,
        gems: totalGems,
        achievement,
        game,
        claimCount: 1
      }
    });
  } catch (error) {
    console.error('Error claiming reward:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Claim daily reward
router.post('/claim/daily', verifyToken, async (req, res) => {
  try {
    const { game, achievement } = req.body;
    const userId = req.user.userId;
    
    const dailyRewards = {
      'kwik-cricket': { 'daily_first_game': { coins: 50, gems: 1 } },
      'cricket-mastermind': { 'daily_first_quiz': { coins: 25, gems: 0 } },
      'imposter': { 'daily_first_game': { coins: 50, gems: 1 } },
      'global': { 'daily_first_win': { coins: 100, gems: 3 } }
    };
    
    const reward = dailyRewards[game]?.[achievement] || dailyRewards.global?.[achievement];
    if (!reward) {
      return res.status(400).json({ success: false, error: 'Invalid daily achievement' });
    }
    
    // Check if already claimed today
    const today = new Date().toDateString();
    const checkResult = await db.query(
      `SELECT last_claimed_at FROM user_daily_claims 
       WHERE user_id = $1 AND claim_key = $2 AND last_claimed_at::DATE = CURRENT_DATE`,
      [userId, `${game}_${achievement}`]
    );
    
    if (checkResult.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Already claimed today' });
    }
    
    // Update user currency
    await getOrCreateCurrency(userId);
    await updateCurrency(userId, reward.gems, reward.coins);
    
    // Record daily claim
    await db.query(
      `INSERT INTO user_daily_claims (user_id, claim_key, last_claimed_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (user_id, claim_key) DO UPDATE SET last_claimed_at = CURRENT_TIMESTAMP`,
      [userId, `${game}_${achievement}`]
    );
    
    res.json({
      success: true,
      reward: {
        coins: reward.coins,
        gems: reward.gems,
        achievement,
        game,
        isDaily: true
      }
    });
  } catch (error) {
    console.error('Error claiming daily reward:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get reward summary
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const currency = await getOrCreateCurrency(userId);
    
    res.json({
      total_coins: (currency.coins || 500) - 500,
      total_gems: (currency.gems || 100) - 100,
      total_achievements: 0,
      todayRewards: []
    });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;