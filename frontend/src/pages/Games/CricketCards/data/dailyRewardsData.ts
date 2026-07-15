// frontend/src/pages/Games/CricketCards/data/dailyRewardsData.ts
import { DailyReward } from '../types/cricketCards.types';

export const dailyRewardsData: DailyReward[] = [
  { day: 1, coins: 25, gems: 1, freePack: false, isClaimed: false, canClaim: true },
  { day: 2, coins: 50, gems: 1, freePack: false, isClaimed: false, canClaim: false },
  { day: 3, coins: 75, gems: 2, freePack: false, isClaimed: false, canClaim: false },
  { day: 4, coins: 100, gems: 2, freePack: false, isClaimed: false, canClaim: false },
  { day: 5, coins: 150, gems: 3, freePack: false, isClaimed: false, canClaim: false },
  { day: 6, coins: 200, gems: 5, freePack: false, isClaimed: false, canClaim: false },
  { day: 7, coins: 500, gems: 10, freePack: true, isClaimed: false, canClaim: false }
];