// frontend/src/pages/Games/CricketCards/types/cricketCards.types.ts

export type Rarity = 'common' | 'standard' | 'rare' | 'epic' | 'elite' | 'legendary' | 'mythic';
export type PlayerRole = 'batsman' | 'bowler' | 'fielder' | 'allrounder' | 'wicketkeeper';
export type PackType = 'standard' | 'premium' | 'legendary';

export interface CardStats {
  batting: number;
  bowling: number;
  fielding: number;
  leadership: number;
  consistency: number;
  popularity: number;
}

export interface Card {
  id: number;
  playerName: string;
  role: PlayerRole;
  country: string;
  iplTeam: string;
  rarity: Rarity;
  stats: CardStats;
  specialAbility: string;
  cardArtUrl: string;
  cardVersion: string;
  year: number;
  isOwned: boolean;
  quantity: number;
  isFavorite: boolean;
  collectionSets: {
    worldCupWinner: boolean;
    iplCaptain: boolean;
    indianLegend: boolean;
    fastBowler: boolean;
    allRounder: boolean;
    goatEdition: boolean;
  };
}

export interface CollectionSet {
  id: number;
  name: string;
  description: string;
  icon: string;
  requiredCards: number[];
  totalCards: number;
  bonusPoints: number;
  badgeImageUrl: string;
  progress: number;
  isCompleted: boolean;
}

export interface Pack {
  type: PackType;
  name: string;
  description: string;
  costCoins: number;
  costGems: number;
  probabilities: {
    common: number;
    rare: number;
    epic: number;
    legendary: number;
    mythic: number;
    elite: number;
    standard: number;
  };
  cardCount: number;
  imageUrl: string;
}

export interface UserCurrency {
  gems: number;
  coins: number;
  totalGemsEarned: number;
  totalCoinsEarned: number;
  totalSpentGems: number;
  totalSpentCoins: number;
}

export interface DailyReward {
  day: number;
  coins: number;
  gems: number;
  freePack: boolean;
  isClaimed: boolean;
  canClaim: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  currentProgress: number;
  rewardCoins: number;
  rewardGems: number;
  isCompleted: boolean;
  icon: string;
}

export interface PurchasePackage {
  id: string;
  name: string;
  gems: number;
  bonusGems: number;
  priceUsd: number;
  popular?: boolean;
  bestValue?: boolean;
}

export interface CardCollection {
  cards: Card[];
  totalCards: number;
  uniqueCards: number;
  mythicCards:number;
  completionRate: number;
  setsCompleted: number;
  totalSets: number;
  sets?: CollectionSet[];
}

export const RARITY_COLORS: Record<Rarity, { border: string; glow: string; badge: string; text: string }> = {
  common: {
    border: 'border-gray-400',
    glow: 'shadow-gray-400/20',
    badge: 'bg-gray-400',
    text: 'text-gray-300'
  },
  standard: {
    border: 'border-slate-400',
    glow: 'shadow-slate-400/25',
    badge: 'bg-gradient-to-r from-slate-500 to-gray-600',
    text: 'text-slate-300'
  },
  rare: {
    border: 'border-blue-500',
    glow: 'shadow-blue-500/30',
    badge: 'bg-gradient-to-r from-blue-500 to-cyan-600',
    text: 'text-blue-400'
  },
  epic: {
    border: 'border-purple-500',
    glow: 'shadow-purple-500/40',
    badge: 'bg-gradient-to-r from-purple-500 to-fuchsia-600',
    text: 'text-purple-400'
  },
  elite: {
    border: 'border-cyan-500',
    glow: 'shadow-cyan-500/45',
    badge: 'bg-gradient-to-r from-cyan-500 to-teal-600',
    text: 'text-cyan-400'
  },
  legendary: {
    border: 'border-yellow-500',
    glow: 'shadow-yellow-500/50',
    badge: 'bg-yellow-500',
    text: 'text-yellow-400'
  },
  mythic: {
    border: 'border-red-500',
    glow: 'shadow-red-500/60',
    badge: 'bg-gradient-to-r from-red-500 to-orange-500',
    text: 'text-red-400'
  }
};

export const RARITY_STARS: Record<Rarity, number> = {
  common: 1,
  standard: 2,
  rare: 2,
  epic: 3,
  elite: 4,
  legendary: 4,
  mythic: 5
};