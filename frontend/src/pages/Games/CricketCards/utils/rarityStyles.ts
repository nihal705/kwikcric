// frontend/src/pages/Games/CricketCards/utils/rarityStyles.ts

export const getRarityFrameClass = (rarity: string): string => {
  switch(rarity) {
    case 'mythic':
      return 'card-frame-mythic';
    case 'legendary':
      return 'card-frame-legendary';
    case 'epic':
      return 'card-frame-epic';
    case 'rare':
      return 'card-frame-rare';
    default:
      return 'card-frame-common';
  }
};

export const getRarityGradient = (rarity: string): string => {
  switch(rarity) {
    case 'mythic':
      return 'bg-gradient-to-br from-red-600 via-orange-500 to-yellow-500';
    case 'legendary':
      return 'bg-gradient-to-br from-yellow-600 via-amber-500 to-yellow-400';
    case 'epic':
      return 'bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-500';
    case 'rare':
      return 'bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500';
    default:
      return 'bg-gradient-to-br from-gray-700 via-gray-600 to-gray-500';
  }
};

export const getRarityStarColor = (rarity: string): string => {
  switch(rarity) {
    case 'mythic':
      return 'text-red-400';
    case 'legendary':
      return 'text-yellow-400';
    case 'epic':
      return 'text-purple-400';
    case 'rare':
      return 'text-blue-400';
    default:
      return 'text-gray-400';
  }
};