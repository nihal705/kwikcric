// backend/src/services/rewardService.js
const UserCurrency = require('../models/UserCurrency');

// Reward definitions - Repeatable (unlimited times)
const REPEATABLE_REWARDS = {
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

// Daily bonuses
const DAILY_REWARDS = {
  'kwik-cricket': {
    'daily_first_game': { coins: 50, gems: 1 },
  },
  'cricket-mastermind': {
    'daily_first_quiz': { coins: 25, gems: 0 },
  },
  'imposter': {
    'daily_first_game': { coins: 50, gems: 1 },
  },
  'global': {
    'daily_first_win': { coins: 100, gems: 3 },
  }
};

// Simple in-memory store for daily claims (replace with database later)
const dailyClaims = new Map();

class RewardService {
  static calculateReward(game, achievement, progress = 1) {
    const rewards = REPEATABLE_REWARDS[game];
    if (rewards && rewards[achievement]) {
      const reward = rewards[achievement];
      return {
        coins: reward.coins * progress,
        gems: reward.gems * progress,
        achievement,
        game
      };
    }
    return null;
  }

  static async claimRepeatableReward(userId, game, achievement, progress = 1) {
    const reward = this.calculateReward(game, achievement, progress);
    if (!reward) {
      return { success: false, error: 'Invalid achievement' };
    }
    
    // Update user currency
    const updated = await UserCurrency.updateCurrency(userId, reward.gems, reward.coins);
    
    return {
      success: true,
      reward: {
        coins: reward.coins,
        gems: reward.gems,
        achievement,
        game,
        claimCount: 1
      }
    };
  }

  static async claimDailyReward(userId, game, achievement) {
    const today = new Date().toDateString();
    const claimKey = `${userId}_${game}_${achievement}`;
    
    // Check if already claimed today
    const lastClaim = dailyClaims.get(claimKey);
    if (lastClaim === today) {
      return { success: false, error: 'Already claimed today' };
    }
    
    const rewards = { ...DAILY_REWARDS[game], ...DAILY_REWARDS.global };
    const reward = rewards[achievement];
    
    if (!reward) {
      return { success: false, error: 'Invalid daily achievement' };
    }
    
    // Update user currency
    const updated = await UserCurrency.updateCurrency(userId, reward.gems, reward.coins);
    
    // Store claim
    dailyClaims.set(claimKey, today);
    
    return {
      success: true,
      reward: {
        coins: reward.coins,
        gems: reward.gems,
        achievement,
        game,
        isDaily: true
      }
    };
  }

  static async updateUserCurrency(userId, coins, gems) {
    return await UserCurrency.updateCurrency(userId, gems, coins);
  }

  static async getUserRewardSummary(userId) {
    const currency = await UserCurrency.getUserCurrency(userId);
    return {
      total_coins: currency.coins - 500,
      total_gems: currency.gems - 100,
      total_achievements: 0,
      todayRewards: []
    };
  }
}

module.exports = RewardService;