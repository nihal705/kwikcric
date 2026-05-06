// frontend/src/pages/Games/CricketCards/components/CardGrid.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { CardComponent } from './CardComponent';
import { Card } from '../types/cricketCards.types';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card) => void;
  onToggleFavorite: (cardId: number) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, onCardClick, onToggleFavorite }) => {
  if (cards.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
        <div className="text-4xl mb-3 flex justify-center">
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none">
            <rect x="25" y="35" width="50" height="35" rx="4" fill="#2d3748" stroke="#4a5568" strokeWidth="1.5"/>
            <text x="50" y="58" textAnchor="middle" fontSize="12" fill="#718096">🃏</text>
          </svg>
        </div>
        <h3 className="text-base font-semibold text-white mb-1">No Cards Found</h3>
        <p className="text-xs text-gray-400">Open packs to build your collection!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(index * 0.02, 0.3) }}
        >
          <CardComponent 
            card={card} 
            onClick={onCardClick}
            onToggleFavorite={onToggleFavorite}
          />
        </motion.div>
      ))}
    </div>
  );
};