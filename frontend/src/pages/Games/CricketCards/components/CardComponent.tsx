// frontend/src/pages/Games/CricketCards/components/CardComponent.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, RARITY_STARS } from '../types/cricketCards.types';
import { getCardArtUrl } from '../utils/avatarGenerator';

interface CardComponentProps {
  card: Card;
  onClick: (card: Card) => void;
  onToggleFavorite: (cardId: number) => void;
}

export const CardComponent: React.FC<CardComponentProps> = ({ card, onClick, onToggleFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  const stars = RARITY_STARS[card.rarity];

  const getRarityTextClass = () => {
    switch (card.rarity) {
      case 'mythic': return 'mythic-text';
      case 'legendary': return 'legendary-text';
      case 'elite': return 'elite-text';
      case 'epic': return 'epic-text';
      case 'rare': return 'rare-text';
      case 'standard': return 'standard-text';
      default: return 'common-text';
    }
  };

  const getRarityFrameClass = () => {
    switch (card.rarity) {
      case 'mythic': return 'card-frame-mythic';
      case 'legendary': return 'card-frame-legendary';
      case 'elite': return 'card-frame-elite';
      case 'epic': return 'card-frame-epic';
      case 'rare': return 'card-frame-rare';
      case 'standard': return 'card-frame-standard';
      default: return 'card-frame-common';
    }
  };

  const getRarityBgColor = () => {
    switch (card.rarity) {
      case 'mythic': return 'from-red-950/80 via-purple-950/80 to-blue-950/80';
      case 'legendary': return 'from-amber-950/80 to-yellow-950/80';
      case 'elite': return 'from-cyan-950/80 to-teal-950/80';
      case 'epic': return 'from-purple-950/80 to-fuchsia-950/80';
      case 'rare': return 'from-blue-950/80 to-cyan-950/80';
      case 'standard': return 'from-slate-800/80 to-gray-800/80';
      default: return 'from-gray-800 to-gray-900';
    }
  };

  const getRarityBadgeBg = () => {
    switch (card.rarity) {
      case 'mythic': return 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500';
      case 'legendary': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'elite': return 'bg-gradient-to-r from-cyan-500 to-teal-600';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-fuchsia-600';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'standard': return 'bg-gradient-to-r from-slate-500 to-gray-600';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 ${getRarityFrameClass()}`}
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick(card)}
    >
      {/* Legendary-specific glow element */}
      {card.rarity === 'legendary' && <div className="legendary-glow" />}
      
      {/* Legendary crown */}
      {card.rarity === 'legendary' && <div className="legendary-crown" />}
      
      {/* Legendary gems */}
      {card.rarity === 'legendary' && (
        <div className="legendary-gems">
          <span /> <span /> <span /> <span /> <span />
        </div>
      )}
      
      {/* Mythic holographic overlay */}
      {card.rarity === 'mythic' && <div className="mythic-holo" />}
      
      {/* Mythic stars */}
      {card.rarity === 'mythic' && (
        <div className="mythic-stars">
          <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
        </div>
      )}
      
      {/* Mythic dragon */}
      {card.rarity === 'mythic' && <div className="mythic-dragon" />}
      
      {/* Epic corners */}
      {card.rarity === 'epic' && (
        <>
          <div className="card-corner card-corner-tl" />
          <div className="card-corner card-corner-tr" />
          <div className="card-corner card-corner-bl" />
          <div className="card-corner card-corner-br" />
        </>
      )}
      
      {/* Elite diamond */}
      {card.rarity === 'elite' && (
        <div className="elite-diamond" />
      )}
      
      {/* Card Art Section */}
      <div className={`aspect-square bg-gradient-to-br ${getRarityBgColor()} relative overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            src={getCardArtUrl(card)}
            alt={card.playerName}
            className="w-24 h-24 rounded-full object-cover shadow-lg"
            style={{ border: `2px solid ${
              card.rarity === 'mythic' ? '#FBBF24' : 
              card.rarity === 'legendary' ? '#FBBF24' : 
              card.rarity === 'elite' ? '#06B6D4' :
              card.rarity === 'epic' ? '#A855F7' : 
              card.rarity === 'rare' ? '#3B82F6' : 
              card.rarity === 'standard' ? '#64748B' : '#6B7280'
            }` }}
          />
        </div>
        
        {/* Rarity Badge */}
        <div className={`absolute top-2 left-2 w-6 h-6 rounded-full ${getRarityBadgeBg()} flex items-center justify-center text-xs font-bold text-white shadow-lg z-10`}>
          {card.rarity === 'common' && '⬤'}
          {card.rarity === 'standard' && '⬟'}
          {card.rarity === 'rare' && '◆'}
          {card.rarity === 'epic' && '◈'}
          {card.rarity === 'elite' && '✧'}
          {card.rarity === 'legendary' && '★'}
          {card.rarity === 'mythic' && '✦'}
        </div>

        {/* Card Rarity Display */}
        <div className="p-3">
          <h3 className="text-sm font-bold text-white truncate text-center">{card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}</h3>
        </div>
        
        {/* Favorite Button */}
        <button
          className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center transition-colors hover:bg-black/80 z-10 backdrop-blur-sm border border-white/20`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(card.id);
          }}
        >
          <span className={card.isFavorite ? 'text-yellow-400' : 'text-gray-400'} style={{ fontSize: '12px' }}>
            {card.isFavorite ? '★' : '☆'}
          </span>
        </button>
        
        {/* Card Version Ribbon */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-1 text-center">
          <span className="text-[8px] text-gray-300">{card.cardVersion}</span>
        </div>
      </div>
      
      {/* Card Info */}
      <div className="p-3">
        <h3 className="text-sm font-bold text-white truncate text-center">{card.playerName}</h3>
        
        {/* Stars */}
        <div className="flex justify-center items-center gap-0.5 mt-1">
          {Array.from({ length: stars }).map((_, i) => (
            <span key={i} className={`text-[10px] ${getRarityTextClass()}`}>★</span>
          ))}
        </div>
        
        {/* Role and Country */}
        <div className="flex justify-between items-center mt-2 text-[10px]">
          <span className="text-gray-400 capitalize px-2 py-0.5 bg-black/30 rounded">{card.role}</span>
          <span className="text-gray-400 flex items-center gap-1">
            <span className="text-[12px]">
              {card.country === 'India' ? '🇮🇳' : 
               card.country === 'Australia' ? '🇦🇺' : 
               card.country === 'England' ? '🏴󠁧󠁢󠁥󠁮󠁧󠁿' : 
               card.country === 'South Africa' ? '🇿🇦' : 
               card.country === 'New Zealand' ? '🇳🇿' : 
               card.country === 'Pakistan' ? '🇵🇰' : '🌍'}
            </span>
            <span>{card.country}</span>
          </span>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-4 gap-1 mt-2 pt-2 border-t border-gray-700">
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">BAT</div>
            <div className="text-sm font-bold text-white">{card.stats.batting}</div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">BOWL</div>
            <div className="text-sm font-bold text-white">{card.stats.bowling}</div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">FLD</div>
            <div className="text-sm font-bold text-white">{card.stats.fielding}</div>
          </div>
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase tracking-wide">POP</div>
            <div className="text-sm font-bold text-white">{card.stats.popularity}</div>
          </div>
        </div>
        
        {/* Quantity Badge */}
        {card.quantity > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/70 rounded-full px-1.5 py-0.5 backdrop-blur-sm border border-white/20">
            <span className="text-[8px] text-gray-300">x{card.quantity}</span>
          </div>
        )}
      </div>
      
      {/* Hover Glow Effect */}
      {isHovered && (
        <div className={`absolute inset-0 pointer-events-none rounded-xl bg-white/5 transition-opacity duration-300`} />
      )}
    </motion.div>
  );
};