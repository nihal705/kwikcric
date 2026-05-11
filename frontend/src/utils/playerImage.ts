// frontend/src/utils/playerImage.ts
import { getPlayerImageFilename } from '../data/playerImageMapping';

export const getPlayerImageUrl = (playerName: string): string => {
  if (!playerName) return '/images/players/default.png';
  
  const imageName = getPlayerImageFilename(playerName);
  return `/images/players/${imageName}.png`;
};

export const getPlayerFallbackImage = (playerName: string): string => {
  const initials = playerName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=10B981&color=fff&bold=true&size=120`;
};