// frontend/src/pages/Games/CricketCards/hooks/useDailyRewards.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { DailyReward } from '../types/cricketCards.types';
import { dailyRewardsData } from '../data/dailyRewardsData';

const DAILY_STORAGE_KEY = 'cricket_cards_daily';

export const useDailyRewards = () => {
  const [rewards, setRewards] = useState<DailyReward[]>([]);
  const [streak, setStreak] = useState(0);
  const [canClaimToday, setCanClaimToday] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      loadDailyData();
      isInitialized.current = true;
    }
  }, []);

  const loadDailyData = useCallback(() => {
    const saved = localStorage.getItem(DAILY_STORAGE_KEY);
    const today = new Date().toDateString();
    let currentStreak = 0;
    let canClaim = true;
    
    if (saved) {
      const data = JSON.parse(saved);
      currentStreak = data.streak;
      canClaim = data.lastClaimDate !== today;
      
      // Reset streak if more than 1 day missed
      if (data.lastClaimDate) {
        const lastDate = new Date(data.lastClaimDate);
        const currentDate = new Date();
        const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 1) {
          currentStreak = 0;
        }
      }
    }
    
    setStreak(currentStreak);
    setCanClaimToday(canClaim);
    
    // Initialize rewards with claim status
    const updatedRewards = dailyRewardsData.map((reward, index) => ({
      ...reward,
      isClaimed: false,
      canClaim: index === currentStreak && canClaim,
    }));
    setRewards(updatedRewards);
  }, []);

  const claimReward = useCallback(async (day: number): Promise<{ coins: number; gems: number; freePack: boolean } | null> => {
    const reward = rewards.find(r => r.day === day);
    if (!reward || reward.isClaimed || !reward.canClaim) return null;
    
    const today = new Date().toDateString();
    const newStreak = streak + 1;
    
    // Update rewards
    setRewards(prev => prev.map(r => ({
      ...r,
      isClaimed: r.day === day ? true : r.isClaimed,
      canClaim: false,
    })));
    setStreak(newStreak);
    setCanClaimToday(false);
    
    // Save to localStorage
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify({
      streak: newStreak,
      lastClaimDate: today,
    }));
    
    return {
      coins: reward.coins,
      gems: reward.gems,
      freePack: reward.freePack,
    };
  }, [rewards, streak]);

  const getNextReward = useCallback((): DailyReward | null => {
    const nextDay = streak + 1;
    return rewards.find(r => r.day === nextDay) || null;
  }, [rewards, streak]);

  return {
    rewards,
    streak,
    canClaimToday,
    claimReward,
    getNextReward,
  };
};