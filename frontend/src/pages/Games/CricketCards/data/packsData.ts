// frontend/src/pages/Games/CricketCards/data/packsData.ts
import { Pack } from '../types/cricketCards.types';

export const packsData: Pack[] = [
  {
    type: 'standard',
    name: 'Standard Pack',
    description: 'Basic card pack with higher chance of common cards',
    costCoins: 500,
    costGems: 0,
    probabilities: {
      common: 0.50,
      standard: 0.35,
      rare: 0.15,
      epic: 0.03,
      elite: 0.02,
      legendary: 0.00,
      mythic: 0
    },
    cardCount: 5,
    imageUrl: '/images/packs/standard-pack.png'
  },
  {
    type: 'premium',
    name: 'Premium Pack',
    description: 'Better chances for rare and epic cards',
    costCoins: 0,
    costGems: 599,
    probabilities: {
      common: 0.20,
      standard: 0.20,
      rare: 0.25,
      epic: 0.25,
      elite: 0.10,
      legendary: 0.00,
      mythic: 0.00
    },
    cardCount: 5,
    imageUrl: '/images/packs/premium-pack.png'
  },
  {
    type: 'legendary',
    name: 'Exclusive Pack',
    description: 'Guaranteed legendary or better cards',
    costCoins: 0,
    costGems: 999,
    probabilities: {
      common: 0,
      standard: 0,
      rare: 0.20,
      epic: 0.20,
      elite: 0.25,
      legendary: 0.25,
      mythic: 0.10
    },
    cardCount: 5,
    imageUrl: '/images/packs/legendary-pack.png'
  }
];

export const getPackByType = (type: string): Pack | undefined => packsData.find(pack => pack.type === type);