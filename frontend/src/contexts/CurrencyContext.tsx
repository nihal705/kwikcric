// frontend/src/contexts/CurrencyContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { rewardService } from '../services/rewardService';
import { useAuth } from './AuthContext';

interface CurrencyContextType {
  gems: number;
  coins: number;
  addCurrency: (coins: number, gems: number) => Promise<void>;
  spendCurrency: (coins: number, gems: number) => Promise<boolean>;
  refreshCurrency: () => Promise<void>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gems, setGems] = useState(100);
  const [coins, setCoins] = useState(500);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const refreshCurrency = useCallback(async () => {
    try {
      // Always show default for guest users
      if (!isAuthenticated) {
        setGems(100);
        setCoins(500);
        setIsLoading(false);
        return;
      }
      
      const currency = await rewardService.getUserCurrency();
      setGems(currency.gems);
      setCoins(currency.coins);
    } catch (error) {
      console.error('Error refreshing currency:', error);
      // Keep default values
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCurrency();
  }, [refreshCurrency]);

  const addCurrency = useCallback(async (addCoins: number, addGems: number) => {
    // Only update UI, backend handles actual storage for authenticated users
    setCoins(prev => prev + addCoins);
    setGems(prev => prev + addGems);
  }, []);

  const spendCurrency = useCallback(async (spendCoins: number, spendGems: number): Promise<boolean> => {
    if (coins < spendCoins || gems < spendGems) {
      return false;
    }
    
    setCoins(prev => prev - spendCoins);
    setGems(prev => prev - spendGems);
    
    // TODO: Call backend to deduct currency for authenticated users
    return true;
  }, [coins, gems]);

  return (
    <CurrencyContext.Provider value={{
      gems,
      coins,
      addCurrency,
      spendCurrency,
      refreshCurrency,
      isLoading,
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};