// frontend/src/pages/Games/CricketCards/hooks/useCurrency.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { UserCurrency } from '../types/cricketCards.types';

const CURRENCY_STORAGE_KEY = 'cricket_cards_currency';

const DEFAULT_CURRENCY: UserCurrency = {
  gems: 100,
  coins: 500,
  totalGemsEarned: 100,
  totalCoinsEarned: 500,
  totalSpentGems: 0,
  totalSpentCoins: 0,
};

export const useCurrency = () => {
  const [currency, setCurrency] = useState<UserCurrency>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      loadCurrency();
      isInitialized.current = true;
    }
  }, []);

  const loadCurrency = useCallback(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCurrency(parsed);
      } else {
        setCurrency(DEFAULT_CURRENCY);
        localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(DEFAULT_CURRENCY));
      }
    } catch (error) {
      console.error('Error loading currency:', error);
      setCurrency(DEFAULT_CURRENCY);
    }
    setIsLoading(false);
  }, []);

  const saveCurrency = useCallback((newCurrency: UserCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, JSON.stringify(newCurrency));
  }, []);

  const addCurrency = useCallback(async (coins: number, gems: number): Promise<boolean> => {
    try {
      const newCurrency = {
        ...currency,
        coins: currency.coins + coins,
        gems: currency.gems + gems,
        totalCoinsEarned: currency.totalCoinsEarned + coins,
        totalGemsEarned: currency.totalGemsEarned + gems,
      };
      saveCurrency(newCurrency);
      return true;
    } catch (error) {
      console.error('Error adding currency:', error);
      return false;
    }
  }, [currency, saveCurrency]);

  const spendCurrency = useCallback(async (coins: number, gems: number): Promise<boolean> => {
    try {
      // Check if user has enough currency
      if (currency.coins < coins || currency.gems < gems) {
        console.log('Insufficient currency:', { have: { coins: currency.coins, gems: currency.gems }, need: { coins, gems } });
        return false;
      }
      
      const newCurrency = {
        ...currency,
        coins: currency.coins - coins,
        gems: currency.gems - gems,
        totalSpentCoins: currency.totalSpentCoins + coins,
        totalSpentGems: currency.totalSpentGems + gems,
      };
      saveCurrency(newCurrency);
      return true;
    } catch (error) {
      console.error('Error spending currency:', error);
      return false;
    }
  }, [currency, saveCurrency]);

  const canAfford = useCallback((coins: number, gems: number): boolean => {
    return currency.coins >= coins && currency.gems >= gems;
  }, [currency.coins, currency.gems]);

  const getBalance = useCallback(() => ({
    coins: currency.coins,
    gems: currency.gems,
  }), [currency.coins, currency.gems]);

  return {
    currency,
    isLoading,
    addCurrency,
    spendCurrency,
    canAfford,
    getBalance,
    loadCurrency,
  };
};