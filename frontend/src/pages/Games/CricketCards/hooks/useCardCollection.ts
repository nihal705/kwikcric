// frontend/src/pages/Games/CricketCards/hooks/useCardCollection.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardCollection, PackType, Rarity } from '../types/cricketCards.types';
import { cardsData } from '../data/cardsData';
import { collectionSetsData } from '../data/collectionSetsData';
import { openPack as openPackService } from '../services/cardAPI';

export const useCardCollection = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);
  const [collectionStats, setCollectionStats] = useState<CardCollection>({
    cards: [],
    totalCards: 0,
    uniqueCards: 0,
    mythicCards:0,
    completionRate: 0,
    setsCompleted: 0,
    totalSets: collectionSetsData.length,
  });
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!isInitialized.current) {
      loadCards();
      isInitialized.current = true;
    }
  }, []);

  const loadCards = useCallback(() => {
    try {
      const savedCards = localStorage.getItem('cricket_cards_collection');
      if (savedCards) {
        const parsedCards = JSON.parse(savedCards);
        setCards(parsedCards);
        updateOwnedCards(parsedCards);
      } else {
        setCards([]);
        setOwnedCards([]);
        updateOwnedCards([]);
      }
    } catch (error) {
      console.error('Error loading cards:', error);
      setCards([]);
      setOwnedCards([]);
    }
  }, []);

  const updateOwnedCards = useCallback((allCards: Card[]) => {
  // Get unique cards
  const unique = allCards.filter((card, index, self) => 
    index === self.findIndex(c => c.id === card.id)
  );
  setOwnedCards(unique);
  
  // DEBUG: Check the actual length
  console.log('cardsData.length:', cardsData.length);
  console.log('Last few card IDs:', cardsData.slice(-5).map(c => c.id));
  
  // Update collection stats
  const totalUniqueCards = unique.length;
  const totalCardsInGame = cardsData.length; // This should be 555
  const completionRate = totalCardsInGame > 0 ? Math.round((totalUniqueCards / totalCardsInGame) * 100) : 0;
  
  console.log('Total cards in game:', totalCardsInGame);
  console.log('Unique cards owned:', totalUniqueCards);
  console.log('Completion rate:', completionRate);
    
    // Calculate sets completed
    let setsCompleted = 0;
    const setsWithProgress = collectionSetsData.map(set => {
      const requiredCardIds = set.requiredCards;
      const ownedCount = requiredCardIds.filter(cardId => 
        unique.some(card => card.id === cardId)
      ).length;
      if (ownedCount === requiredCardIds.length) setsCompleted++;
      return {
        ...set,
        progress: ownedCount,
        isCompleted: ownedCount === requiredCardIds.length
      };
    });
    
    setCollectionStats({
      cards: unique,
      totalCards: allCards.length,
      uniqueCards: totalUniqueCards,
      completionRate: completionRate,
      setsCompleted: setsCompleted,
      totalSets: collectionSetsData.length,
      sets: setsWithProgress,
    } as any);
  }, []);

  const addCard = useCallback((card: Card) => {
    setCards(prevCards => {
      const existingCard = prevCards.find(c => c.id === card.id);
      let newCards;
      
      if (existingCard) {
        newCards = prevCards.map(c =>
          c.id === card.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        newCards = [...prevCards, { ...card, quantity: 1, isOwned: true, isFavorite: false }];
      }
      
      localStorage.setItem('cricket_cards_collection', JSON.stringify(newCards));
      updateOwnedCards(newCards);
      return newCards;
    });
  }, [updateOwnedCards]);

  const openPack = useCallback(async (packType: PackType): Promise<Card[]> => {
    console.log('Opening pack in hook:', packType);
    const openedCards = await openPackService(packType);
    console.log('Cards received:', openedCards.length);
    
    // Add each card to collection
    openedCards.forEach(card => {
      addCard(card);
    });
    
    return openedCards;
  }, [addCard]);

  const addToFavorites = useCallback((cardId: number) => {
    setCards(prevCards => {
      const newCards = prevCards.map(card =>
        card.id === cardId ? { ...card, isFavorite: true } : card
      );
      localStorage.setItem('cricket_cards_collection', JSON.stringify(newCards));
      updateOwnedCards(newCards);
      return newCards;
    });
  }, [updateOwnedCards]);

  const removeFromFavorites = useCallback((cardId: number) => {
    setCards(prevCards => {
      const newCards = prevCards.map(card =>
        card.id === cardId ? { ...card, isFavorite: false } : card
      );
      localStorage.setItem('cricket_cards_collection', JSON.stringify(newCards));
      updateOwnedCards(newCards);
      return newCards;
    });
  }, [updateOwnedCards]);

  const getCardsByRarity = useCallback((rarity: Rarity): Card[] => {
    return ownedCards.filter(card => card.rarity === rarity);
  }, [ownedCards]);

  const getCompletionPercentage = useCallback((): number => {
    return collectionStats.completionRate;
  }, [collectionStats.completionRate]);

  return {
    cards,
    ownedCards,
    collectionStats,
    openPack,
    addCard,
    addToFavorites,
    removeFromFavorites,
    getCardsByRarity,
    getCompletionPercentage,
    loadCards,
  };
};