// frontend/src/hooks/useRewards.ts
import { useState, useCallback } from 'react';
import { rewardService } from '../services/rewardService';
import { useCurrency } from '../contexts/CurrencyContext';

interface RewardState {
  showNotification: boolean;
  currentReward: { coins: number; gems: number; achievement: string; game: string } | null;
}

export const useRewards = () => {
  const [state, setState] = useState<RewardState>({
    showNotification: false,
    currentReward: null,
  });
  const { addCurrency, refreshCurrency } = useCurrency();

  const claimReward = useCallback(async (
    game: string,
    achievement: string,
    progress: number = 1
  ) => {
    const reward = await rewardService.claimRepeatableReward(game, achievement, progress);
    
    if (reward) {
      // Update UI
      addCurrency(reward.coins, reward.gems);
      
      // Show notification
      setState({
        showNotification: true,
        currentReward: reward,
      });
      
      // Refresh currency display
      await refreshCurrency();
    }
    
    return reward;
  }, [addCurrency, refreshCurrency]);

  const claimDailyReward = useCallback(async (game: string, achievement: string) => {
    const reward = await rewardService.claimDailyReward(game, achievement);
    
    if (reward) {
      addCurrency(reward.coins, reward.gems);
      setState({
        showNotification: true,
        currentReward: reward,
      });
      await refreshCurrency();
    }
    
    return reward;
  }, [addCurrency, refreshCurrency]);

  const hideNotification = useCallback(() => {
    setState(prev => ({ ...prev, showNotification: false }));
  }, []);

  return {
    claimReward,
    claimDailyReward,
    showNotification: state.showNotification,
    currentReward: state.currentReward,
    hideNotification,
  };
};