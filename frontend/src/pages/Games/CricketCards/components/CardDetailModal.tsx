// frontend/src/pages/Games/CricketCards/components/CardDetailModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, RARITY_COLORS, RARITY_STARS } from '../types/cricketCards.types';
import { getCardArtUrl } from '../utils/avatarGenerator';

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
  onToggleFavorite: (cardId: number) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose, onToggleFavorite }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const colors = RARITY_COLORS[card.rarity];
  const stars = RARITY_STARS[card.rarity];

  const statBars = [
    { label: 'Batting', value: card.stats.batting, color: 'bg-emerald-500' },
    { label: 'Bowling', value: card.stats.bowling, color: 'bg-rose-500' },
    { label: 'Fielding', value: card.stats.fielding, color: 'bg-sky-500' },
    { label: 'Leadership', value: card.stats.leadership, color: 'bg-purple-500' },
    { label: 'Consistency', value: card.stats.consistency, color: 'bg-amber-500' },
    { label: 'Popularity', value: card.stats.popularity, color: 'bg-pink-500' },
  ];

  const getRarityFrameClass = () => {
    switch (card.rarity) {
      case 'mythic': return 'card-frame-mythic';
      case 'legendary': return 'card-frame-legendary';
      case 'epic': return 'card-frame-epic';
      case 'rare': return 'card-frame-rare';
      default: return 'card-frame-common';
    }
  };

  return (
<div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0.9, opacity: 0 }}
    className="relative max-w-3xl w-full"  // Changed from max-w-4xl to max-w-3xl
  >
    {/* Close Button - smaller */}
    <button
      onClick={onClose}
      className="absolute -top-10 right-0 text-gray-400 hover:text-white text-2xl z-10 transition-colors"
    >
      ×
    </button>
    
    {/* Card Container with Flip */}
    <div 
      className="relative w-full cursor-pointer"
      style={{ perspective: '2000px' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Card Front - Smaller size */}
        <div className={`bg-gray-800 rounded-xl overflow-hidden border-2 ${colors.border} shadow-2xl ${getRarityFrameClass()}`}
             style={{ backfaceVisibility: 'hidden' }}>
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left Side - Card Art (Smaller) */}
            <div className="bg-gradient-to-br from-gray-700 to-gray-800 p-4 flex flex-col items-center justify-center min-h-[320px]">
              <div className="w-28 h-28 rounded-full bg-gray-600/30 flex items-center justify-center mb-3 overflow-hidden">
                <img 
                  src={getCardArtUrl(card)}
                  alt={card.playerName}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <div className={`text-xs font-semibold px-3 py-0.5 rounded-full ${colors.badge} text-white mb-2 shadow-lg`}>
                {card.rarity.toUpperCase()}
              </div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-white">{card.playerName}</h2>
                <p className="text-xs text-gray-400 mt-0.5 capitalize">{card.role} • {card.country}</p>
                {card.iplTeam && <p className="text-xs text-gray-500">{card.iplTeam}</p>}
              </div>
              <div className="flex mt-2">
                {Array.from({ length: stars }).map((_, i) => (
                  <span key={i} className={`text-sm ${colors.text} mx-0.5`}>★</span>
                ))}
              </div>
              <div className="mt-3 text-center">
                <div className="text-[10px] text-gray-500">{card.cardVersion}</div>
                <div className="text-[10px] text-gray-500">{card.year} Edition</div>
              </div>
            </div>
            
            {/* Right Side - Card Stats (Smaller) */}
            <div className="p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-base font-semibold text-white">Statistics</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(card.id);
                  }}
                  className={`text-xl ${card.isFavorite ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-400 transition`}
                >
                  {card.isFavorite ? '★' : '☆'}
                </button>
              </div>
              
              <div className="space-y-2">
                {statBars.map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
                      <span>{stat.label}</span>
                      <span className="font-mono">{stat.value}/100</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.value}%` }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={`${stat.color} h-1.5 rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Special Ability */}
              <div className="mt-4 p-2 bg-gray-700/30 rounded-lg border border-gray-600">
                <div className="text-[9px] text-gray-400 mb-0.5">Special Ability</div>
                <div className={`text-[11px] font-medium ${colors.text}`}>{card.specialAbility}</div>
              </div>
              
              {/* Collection Sets - Smaller tags */}
              <div className="mt-3">
                <div className="text-[9px] text-gray-400 mb-1.5">Collection Sets</div>
                <div className="flex flex-wrap gap-1.5">
                  {card.collectionSets.worldCupWinner && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-emerald-900/50 rounded-full text-emerald-400 border border-emerald-500/30">🏆 World Cup</span>
                  )}
                  {card.collectionSets.iplCaptain && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-blue-900/50 rounded-full text-blue-400 border border-blue-500/30">👑 IPL Captain</span>
                  )}
                  {card.collectionSets.indianLegend && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-orange-900/50 rounded-full text-orange-400 border border-orange-500/30">🇮🇳 Indian Legend</span>
                  )}
                  {card.collectionSets.fastBowler && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-red-900/50 rounded-full text-red-400 border border-red-500/30">⚡ Fast Bowler</span>
                  )}
                  {card.collectionSets.allRounder && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-purple-900/50 rounded-full text-purple-400 border border-purple-500/30">🔄 All-Rounder</span>
                  )}
                  {card.collectionSets.goatEdition && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-yellow-900/50 rounded-full text-yellow-400 border border-yellow-500/30">🐐 GOAT</span>
                  )}
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-gray-700">
                <div className="text-center text-[10px] text-gray-500">
                  Tap card to {isFlipped ? 'see front' : 'see back'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Back - Smaller */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden border-2 border-gray-600 p-4 flex flex-col items-center justify-center text-center"
             style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center mb-3 shadow-xl">
            <span className="text-2xl text-white font-bold">♢</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Cricket Champions</h3>
          <p className="text-gray-400 text-xs mb-3">Trading Card Collection</p>
          <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
              <path d="M20 5L25 15L35 18L28 26L30 36L20 31L10 36L12 26L5 18L15 15L20 5Z" fill="#FBBF24" stroke="#D97706" strokeWidth="1"/>
            </svg>
          </div>
          <div className="mt-3 text-[10px] text-gray-500">
            Edition {card.year}
          </div>
          <div className="mt-2 text-[8px] text-gray-600">
            {card.playerName} • {card.rarity.toUpperCase()}
          </div>
        </div>
      </motion.div>
    </div>
    
    {/* Flip Indicator - Smaller */}
    <div className="text-center mt-3">
      <span className="text-[10px] text-gray-500 bg-black/50 px-2 py-0.5 rounded-full">Tap to {isFlipped ? 'see front' : 'see back'}</span>
    </div>
  </motion.div>
</div>
  );
};