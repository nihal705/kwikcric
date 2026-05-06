// frontend/src/pages/Games/CricketCards/services/purchaseAPI.ts
import { PurchasePackage } from '../types/cricketCards.types';
import { purchasePackages } from '../data/purchasePackages';
import { addCurrency } from './currencyAPI';

// Mock payment processing - in production, integrate with actual payment gateway
export const processPurchase = async (packageId: string): Promise<{ success: boolean; gems?: number; error?: string }> => {
  const pkg = purchasePackages.find(p => p.id === packageId);
  if (!pkg) {
    return { success: false, error: 'Package not found' };
  }
  
  // Simulate payment processing delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Add gems to user account
  const gemsToAdd = pkg.gems + pkg.bonusGems;
  const result = await addCurrency(0, gemsToAdd);
  
  if (result) {
    return { success: true, gems: gemsToAdd };
  }
  
  return { success: false, error: 'Failed to add gems' };
};

export const getPurchasePackages = async (): Promise<PurchasePackage[]> => {
  return purchasePackages;
};

export const validatePurchase = async (packageId: string): Promise<boolean> => {
  const pkg = purchasePackages.find(p => p.id === packageId);
  return !!pkg;
};