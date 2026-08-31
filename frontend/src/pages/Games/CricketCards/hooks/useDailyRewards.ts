// frontend/src/pages/Games/CricketCards/hooks/useDailyRewards.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { DailyReward } from '../types/cricketCards.types';
import { dailyRewardsData } from '../data/dailyRewardsData';

const DAILY_STORAGE_KEY = 'cricket_cards_daily';

export const useDailyRewards = () => {
  const [rewards, setRewards] = useState<DailyReward[]>([]);
  const [streak, setStreak] = useState(0);
  const [canClaimToday, setCanClaimToday] = useState(true);
  const [claimedDays, setClaimedDays] = useState<number[]>([]);
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
    let savedLastClaimDate: string | null = null;
    let savedClaimedDays: number[] = [];
    
    if (saved) {
      const data = JSON.parse(saved);
      currentStreak = data.streak || 0;
      savedLastClaimDate = data.lastClaimDate || null;
      savedClaimedDays = data.claimedDays || [];
      
      // Check if already claimed today
      if (savedLastClaimDate === today) {
        canClaim = false;
      } else {
        canClaim = true;
        
        // Check if missed a day to reset streak
        if (savedLastClaimDate) {
          const lastDate = new Date(savedLastClaimDate);
          const currentDate = new Date();
          const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
          
          if (diffDays > 1) {
            // Missed a day, reset streak
            currentStreak = 0;
            savedClaimedDays = [];
          }
        }
      }
    }
    
    setStreak(currentStreak);
    setCanClaimToday(canClaim);
    setClaimedDays(savedClaimedDays);
    
    // Initialize rewards with claim status
    const updatedRewards = dailyRewardsData.map((reward, index) => {
      const dayNum = index + 1;
      const isClaimed = savedClaimedDays.includes(dayNum);
      const canClaimThisDay = canClaim && dayNum === (currentStreak + 1) && !isClaimed;
      
      return {
        ...reward,
        isClaimed: isClaimed,
        canClaim: canClaimThisDay,
      };
    });
    
    setRewards(updatedRewards);
  }, []);

  const claimReward = useCallback(async (day: number): Promise<{ coins: number; gems: number; freePack: boolean } | null> => {
    const reward = rewards.find(r => r.day === day);
    
    // Check if reward exists, already claimed, or can't claim
    if (!reward || reward.isClaimed || !reward.canClaim) {
      return null;
    }
    
    const today = new Date().toDateString();
    const newStreak = streak + 1;
    const newClaimedDays = [...claimedDays, day];
    
    // Update rewards
    const updatedRewards = rewards.map(r => ({
      ...r,
      isClaimed: r.day === day ? true : r.isClaimed,
      canClaim: false,
    }));
    
    setRewards(updatedRewards);
    setStreak(newStreak);
    setCanClaimToday(false);
    setClaimedDays(newClaimedDays);
    
    // Save to localStorage
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify({
      streak: newStreak,
      lastClaimDate: today,
      claimedDays: newClaimedDays,
    }));
    
    return {
      coins: reward.coins,
      gems: reward.gems,
      freePack: reward.freePack,
    };
  }, [rewards, streak, claimedDays]);

  const getNextReward = useCallback((): DailyReward | null => {
    const nextDay = streak + 1;
    if (nextDay > 7) return null;
    return rewards.find(r => r.day === nextDay) || null;
  }, [rewards, streak]);

  const resetDailyData = useCallback(() => {
    localStorage.removeItem(DAILY_STORAGE_KEY);
    loadDailyData();
  }, [loadDailyData]);

  return {
    rewards,
    streak,
    canClaimToday,
    claimReward,
    getNextReward,
    resetDailyData,
  };
};