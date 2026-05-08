// frontend/src/pages/Games/CricketCards/services/cardAPI.ts
import { Card, PackType, Rarity } from '../types/cricketCards.types';
import { cardsData } from '../data/cardsData';
import { packsData } from '../data/packsData';

// Get random card ONLY from the specified rarity
const getRandomCardByRarity = (rarity: Rarity): Card | null => {
  const cardsOfRarity = cardsData.filter(card => card.rarity === rarity);
  if (cardsOfRarity.length === 0) {
    console.warn(`No cards found for rarity: ${rarity}`);
    return null;
  }
  const randomIndex = Math.floor(Math.random() * cardsOfRarity.length);
  return { ...cardsOfRarity[randomIndex], isOwned: true, quantity: 1, isFavorite: false };
};

const getRarityFromProbability = (probabilities: Record<Rarity, number>): Rarity | null => {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [rarity, probability] of Object.entries(probabilities)) {
    if (probability === 0) continue; // Skip zero probabilities
    cumulative += probability;
    if (random < cumulative) {
      return rarity as Rarity;
    }
  }
  return null; // No valid rarity found
};

export const openPack = async (packType: PackType): Promise<Card[]> => {
  const pack = packsData.find(p => p.type === packType);
  if (!pack) throw new Error('Invalid pack type');
  
  const cards: Card[] = [];
  const probabilities = pack.probabilities as Record<Rarity, number>;
  
  for (let i = 0; i < pack.cardCount; i++) {
    const rarity = getRarityFromProbability(probabilities);
    
    if (rarity) {
      const card = getRandomCardByRarity(rarity);
      if (card) {
        cards.push(card);
      } else {
        // Fallback to common if specific rarity fails
        const fallbackCard = getRandomCardByRarity('common');
        if (fallbackCard) cards.push(fallbackCard);
      }
    } else {
      // Ultimate fallback - get any card
      const randomIndex = Math.floor(Math.random() * cardsData.length);
      cards.push({ ...cardsData[randomIndex], isOwned: true, quantity: 1, isFavorite: false });
    }
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  return cards;
};

export const getAllCards = async (): Promise<Card[]> => {
  return cardsData;
};

export const getCardById = async (id: number): Promise<Card | undefined> => {
  return cardsData.find(card => card.id === id);
};

export const getCardsByRarity = async (rarity: Rarity): Promise<Card[]> => {
  return cardsData.filter(card => card.rarity === rarity);
};