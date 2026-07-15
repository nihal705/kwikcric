// frontend/src/pages/Games/CricketCards/data/achievementsData.ts
import { Achievement } from '../types/cricketCards.types';

export const achievementsData: Achievement[] = [
  {
    id: 'first_pack',
    name: 'First Pack',
    description: 'Open your first card pack',
    requirement: 1,
    currentProgress: 0,
    rewardCoins: 100,
    rewardGems: 2,
    isCompleted: false,
    icon: '📦'
  },
  {
    id: 'collect_10',
    name: 'Collector',
    description: 'Collect 10 unique cards',
    requirement: 10,
    currentProgress: 0,
    rewardCoins: 200,
    rewardGems: 5,
    isCompleted: false,
    icon: '🎴'
  },
  {
    id: 'collect_50',
    name: 'Master Collector',
    description: 'Collect 50 unique cards',
    requirement: 50,
    currentProgress: 0,
    rewardCoins: 1000,
    rewardGems: 25,
    isCompleted: false,
    icon: '🏅'
  },
  {
    id: 'collect_100',
    name: 'Legendary Collector',
    description: 'Collect 100 unique cards',
    requirement: 100,
    currentProgress: 0,
    rewardCoins: 5000,
    rewardGems: 100,
    isCompleted: false,
    icon: '🏆'
  },
  {
    id: 'legendary_card',
    name: 'Lucky Pull',
    description: 'Get a legendary card from a pack',
    requirement: 1,
    currentProgress: 0,
    rewardCoins: 500,
    rewardGems: 10,
    isCompleted: false,
    icon: '⭐'
  },
  {
    id: 'mythic_card',
    name: 'Mythic Hunter',
    description: 'Get a mythic card from a pack',
    requirement: 1,
    currentProgress: 0,
    rewardCoins: 2000,
    rewardGems: 100,
    isCompleted: false,
    icon: '💎'
  },
  {
    id: 'complete_set',
    name: 'Set Completer',
    description: 'Complete a collection set',
    requirement: 1,
    currentProgress: 0,
    rewardCoins: 2000,
    rewardGems: 50,
    isCompleted: false,
    icon: '🎯'
  },
  {
    id: 'open_10_packs',
    name: 'Pack Maniac',
    description: 'Open 10 packs',
    requirement: 10,
    currentProgress: 0,
    rewardCoins: 500,
    rewardGems: 15,
    isCompleted: false,
    icon: '📦'
  },
  {
    id: 'open_100_packs',
    name: 'Ultimate Packer',
    description: 'Open 100 packs',
    requirement: 100,
    currentProgress: 0,
    rewardCoins: 5000,
    rewardGems: 200,
    isCompleted: false,
    icon: '💪'
  }
];

export const getAchievementById = (id: string): Achievement | undefined => 
  achievementsData.find(ach => ach.id === id);