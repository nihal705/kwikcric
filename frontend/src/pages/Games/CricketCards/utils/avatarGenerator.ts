// frontend/src/pages/Games/CricketCards/utils/avatarGenerator.ts

export const getCardArtUrl = (card: { playerName: string; country: string; role: string; rarity: string }): string => {
  // Convert player name to file-friendly format
  const imageName = card.playerName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '')
    .replace(/[^a-z0-9-]/g, '');

  return `/images/players/${imageName}.png`;
};