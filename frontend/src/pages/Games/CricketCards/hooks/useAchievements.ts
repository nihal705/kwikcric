// frontend/src/pages/Games/CricketCards/hooks/useAchievements.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Achievement } from '../types/cricketCards.types';
import { achievementsData } from '../data/achievementsData';

const ACHIEVEMENTS_STORAGE_KEY = 'cricket_cards_achievements';

export const useAchievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      loadAchievements();
      isInitialized.current = true;
    }
  }, []);

  const loadAchievements = useCallback(() => {
    const saved = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (saved) {
      setAchievements(JSON.parse(saved));
    } else {
      setAchievements(achievementsData);
    }
  }, []);

  const updateProgress = useCallback((achievementId: string, increment: number) => {
    setAchievements(prev => {
      let hasChanges = false;
      const updated = prev.map(ach => {
        if (ach.id === achievementId && !ach.isCompleted) {
          const newProgress = Math.min(ach.currentProgress + increment, ach.requirement);
          const isCompleted = newProgress >= ach.requirement;
          if (newProgress !== ach.currentProgress) {
            hasChanges = true;
          }
          return { ...ach, currentProgress: newProgress, isCompleted };
        }
        return ach;
      });
      
      if (hasChanges) {
        localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const getCompletedAchievements = useCallback(() => {
    return achievements.filter(ach => ach.isCompleted);
  }, [achievements]);

  const getPendingAchievements = useCallback(() => {
    return achievements.filter(ach => !ach.isCompleted);
  }, [achievements]);

  const getCompletionPercentage = useCallback(() => {
    const completed = achievements.filter(ach => ach.isCompleted).length;
    return achievements.length > 0 ? Math.round((completed / achievements.length) * 100) : 0;
  }, [achievements]);

  const getTotalRewards = useCallback(() => {
    const completed = achievements.filter(ach => ach.isCompleted);
    return {
      coins: completed.reduce((sum, ach) => sum + ach.rewardCoins, 0),
      gems: completed.reduce((sum, ach) => sum + ach.rewardGems, 0),
    };
  }, [achievements]);

  const checkAchievements = useCallback(async () => {
    return achievements;
  }, [achievements]);

  const resetAchievements = useCallback(() => {
    const resetData = achievementsData.map(ach => ({ ...ach, currentProgress: 0, isCompleted: false }));
    setAchievements(resetData);
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(resetData));
  }, []);

  return {
    achievements,
    updateProgress,
    getCompletedAchievements,
    getPendingAchievements,
    getCompletionPercentage,
    getTotalRewards,
    checkAchievements,
    resetAchievements,
  };
};