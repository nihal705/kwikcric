// frontend/src/pages/Games/CricketCards/hooks/usePackOpening.ts
import { useState } from 'react';
import { Card, PackType } from '../types/cricketCards.types';
import { openPack as openPackService } from '../services/cardAPI';

interface PackOpeningState {
  isOpening: boolean;
  openedCards: Card[];
  currentPackType: PackType | null;
}

export const usePackOpening = () => {
  const [state, setState] = useState<PackOpeningState>({
    isOpening: false,
    openedCards: [],
    currentPackType: null,
  });

  const [animationStage, setAnimationStage] = useState<'idle' | 'shaking' | 'opening' | 'revealing' | 'complete'>('idle');
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);

  const openPack = async (packType: PackType): Promise<Card[]> => {
    setState({ isOpening: true, openedCards: [], currentPackType: packType });
    setAnimationStage('shaking');
    
    // Simulate pack shaking animation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setAnimationStage('opening');
    
    await new Promise(resolve => setTimeout(resolve, 800));
    setAnimationStage('revealing');
    
    const cards = await openPackService(packType);
    setState(prev => ({ ...prev, openedCards: cards }));
    
    // Reveal cards one by one
    for (let i = 0; i < cards.length; i++) {
      setCurrentCardIndex(i);
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    setAnimationStage('complete');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState({ isOpening: false, openedCards: [], currentPackType: null });
    setCurrentCardIndex(-1);
    setAnimationStage('idle');
    
    return cards;
  };

  const reset = () => {
    setState({ isOpening: false, openedCards: [], currentPackType: null });
    setAnimationStage('idle');
    setCurrentCardIndex(-1);
  };

  return {
    ...state,
    animationStage,
    currentCardIndex,
    openPack,
    reset,
  };
};