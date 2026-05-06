// frontend/src/pages/Games/CricketCards/services/currencyAPI.ts
import { UserCurrency } from '../types/cricketCards.types';

const CURRENCY_STORAGE_KEY = 'cricket_cards_currency';

export const getCurrency = async (): Promise<UserCurrency> => {
  const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return {
    gems: 100,
    coins: 500,
    totalGemsEarned: 100,
    totalCoinsEarned: 500,
    totalSpentGems: 0,
    totalSpentCoins: 0,
  };
};

export const updateCurrency = async (currency: UserCurrency): Promise<boolean> => {
  try {
    localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(currency));
    return true;
  } catch {
    return false;
  }
};

export const addCurrency = async (coins: number, gems: number): Promise<UserCurrency | null> => {
  const current = await getCurrency();
  const updated = {
    ...current,
    coins: current.coins + coins,
    gems: current.gems + gems,
    totalCoinsEarned: current.totalCoinsEarned + coins,
    totalGemsEarned: current.totalGemsEarned + gems,
  };
  const success = await updateCurrency(updated);
  return success ? updated : null;
};

export const spendCurrency = async (coins: number, gems: number): Promise<UserCurrency | null> => {
  const current = await getCurrency();
  if (current.coins < coins || current.gems < gems) {
    return null;
  }
  const updated = {
    ...current,
    coins: current.coins - coins,
    gems: current.gems - gems,
    totalSpentCoins: current.totalSpentCoins + coins,
    totalSpentGems: current.totalSpentGems + gems,
  };
  const success = await updateCurrency(updated);
  return success ? updated : null;
};