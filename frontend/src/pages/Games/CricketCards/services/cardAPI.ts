// frontend/src/pages/Games/CricketCards/services/cardAPI.ts
import { Card, PackType, Rarity } from '../types/cricketCards.types';
import { cardsData } from '../data/cardsData';
import { packsData } from '../data/packsData';

const getRandomCard = (rarity: Rarity): Card => {
  const cardsOfRarity = cardsData.filter(card => card.rarity === rarity);
  if (cardsOfRarity.length === 0) {
    return { ...cardsData[0], isOwned: true, quantity: 1, isFavorite: false };
  }
  const randomIndex = Math.floor(Math.random() * cardsOfRarity.length);
  return { ...cardsOfRarity[randomIndex], isOwned: true, quantity: 1, isFavorite: false };
};

const getRarityFromProbability = (probabilities: Record<Rarity, number>): Rarity => {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [rarity, probability] of Object.entries(probabilities)) {
    cumulative += probability;
    if (random < cumulative) {
      return rarity as Rarity;
    }
  }
  return 'common';
};

export const openPack = async (packType: PackType): Promise<Card[]> => {
  const pack = packsData.find(p => p.type === packType);
  if (!pack) throw new Error('Invalid pack type');
  
  const cards: Card[] = [];
  const probabilities = pack.probabilities as Record<Rarity, number>;
  
  for (let i = 0; i < pack.cardCount; i++) {
    const rarity = getRarityFromProbability(probabilities);
    const card = getRandomCard(rarity);
    cards.push(card);
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