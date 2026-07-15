// frontend/src/pages/Games/CricketCards/data/purchasePackages.ts
import { PurchasePackage } from '../types/cricketCards.types';

export const purchasePackages: PurchasePackage[] = [
  { id: 'starter', name: 'Starter Pack', gems: 100, bonusGems: 0, priceUsd: 0.99 },
  { id: 'small', name: 'Small Pack', gems: 500, bonusGems: 50, priceUsd: 4.99 },
  { id: 'medium', name: 'Medium Pack', gems: 1200, bonusGems: 150, priceUsd: 9.99, popular: true },
  { id: 'large', name: 'Large Pack', gems: 2500, bonusGems: 500, priceUsd: 19.99 },
  { id: 'mega', name: 'Mega Pack', gems: 6000, bonusGems: 2000, priceUsd: 49.99, bestValue: true },
  { id: 'legendary', name: 'Legendary Bundle', gems: 15000, bonusGems: 7500, priceUsd: 99.99 }
];

export const getPackageById = (id: string): PurchasePackage | undefined => 
  purchasePackages.find(pkg => pkg.id === id);