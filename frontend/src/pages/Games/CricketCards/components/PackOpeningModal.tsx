// frontend/src/pages/Games/CricketCards/components/PackOpeningModal.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, PackType, RARITY_COLORS } from '../types/cricketCards.types';
import { soundService } from '../services/soundService';
import { getCardArtUrl } from '../utils/avatarGenerator';

interface PackOpeningModalProps {
  packType: PackType;
  cards: Card[];
  onClose: () => void;
}

export const PackOpeningModal: React.FC<PackOpeningModalProps> = ({ packType, cards, onClose }) => {
  const [stage, setStage] = useState<'shaking' | 'opening' | 'revealing' | 'complete'>('shaking');
  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);

  useEffect(() => {
    // Play pack shake sound and start animation
    soundService.playPackShake();
    
    const timer1 = setTimeout(() => {
      setStage('opening');
      soundService.playPackOpen();
    }, 1500);
    
    const timer2 = setTimeout(() => {
      setStage('revealing');
      
      // Reveal cards one by one
      for (let i = 0; i < cards.length; i++) {
        setTimeout(() => {
          setCurrentCardIndex(i);
          setRevealedCards(prev => [...prev, i]);
          soundService.playCardFlip();
          soundService.playRaritySound(cards[i].rarity);
        }, i * 600);
      }
    }, 2500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [cards.length]);

  useEffect(() => {
    if (stage === 'revealing' && currentCardIndex === cards.length - 1 && cards.length > 0) {
      const timer = setTimeout(() => {
        setStage('complete');
        // Check for legendary/mythic for confetti
        const hasLegendaryOrMythic = cards.some(c => c.rarity === 'legendary' || c.rarity === 'mythic');
        if (hasLegendaryOrMythic) {
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 4000);
        }
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentCardIndex, cards.length, stage, cards]);

  const getPackImage = () => {
    switch (packType) {
      case 'standard': return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="30" y="20" width="60" height="80" rx="8" fill="#4B5563" stroke="#6B7280" strokeWidth="3"/>
          <rect x="40" y="30" width="40" height="60" rx="4" fill="#9CA3AF"/>
          <text x="60" y="65" textAnchor="middle" fontSize="20" fill="#374151">📦</text>
        </svg>
      );
      case 'premium': return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="30" y="20" width="60" height="80" rx="8" fill="#1E3A5F" stroke="#3B82F6" strokeWidth="3"/>
          <rect x="40" y="30" width="40" height="60" rx="4" fill="#60A5FA"/>
          <text x="60" y="65" textAnchor="middle" fontSize="20" fill="#1E40AF">✨</text>
        </svg>
      );
      case 'legendary': return (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <rect x="30" y="20" width="60" height="80" rx="8" fill="#78350F" stroke="#FBBF24" strokeWidth="3"/>
          <rect x="40" y="30" width="40" height="60" rx="4" fill="#FCD34D"/>
          <text x="60" y="65" textAnchor="middle" fontSize="20" fill="#B45309">👑</text>
        </svg>
      );
      default: return null;
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'ring-amber-500 shadow-amber-500/50';
      case 'mythic': return 'ring-red-500 shadow-red-500/50';
      case 'epic': return 'ring-purple-500 shadow-purple-500/50';
      case 'rare': return 'ring-blue-500 shadow-blue-500/50';
      default: return 'ring-gray-500 shadow-gray-500/30';
    }
  };

  // Shaking stage
  if (stage === 'shaking') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center py-8">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6, repeat: 2 }}
              className="w-40 h-40 mx-auto rounded-2xl flex items-center justify-center shadow-2xl"
            >
              {getPackImage()}
            </motion.div>
            <motion.h3 
              className="text-2xl font-bold text-white mt-6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              Opening Pack...
            </motion.h3>
            <p className="text-gray-400 mt-2">Get ready for your cards!</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Opening burst stage
  if (stage === 'opening') {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 rounded-2xl p-8 max-w-md w-full mx-4"
        >
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.3, 0] }}
              transition={{ duration: 0.6 }}
              className="w-40 h-40 mx-auto rounded-2xl flex items-center justify-center"
            >
              {getPackImage()}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-2xl font-bold text-white mt-6">Whoosh!</h3>
              <p className="text-gray-400 mt-2">Cards are flying out...</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Cards reveal stage
  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 150 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                animation: `confetti-fall ${Math.random() * 3 + 2}s linear forwards`,
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-2xl p-6 max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white">Your Cards!</h3>
          <p className="text-gray-400 text-sm mt-1">
            {stage === 'complete' ? 'All cards added to your collection' : 'Revealing cards...'}
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cards.map((card, index) => {
            const colors = RARITY_COLORS[card.rarity];
            const isRevealed = revealedCards.includes(index);
            const isCurrent = index === currentCardIndex;
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                animate={isRevealed ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0.3, scale: 0.8, rotateY: 90 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`bg-gray-800 rounded-xl overflow-hidden border-2 ${colors.border} ${isCurrent ? `ring-4 ${getRarityGlow(card.rarity)}` : ''}`}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
                  {isRevealed ? (
                        <>
                        {/* Player Image */}
                        <img 
                            src={getCardArtUrl(card)}
                            alt={card.playerName}
                            className="w-20 h-20 rounded-full object-cover shadow-lg"
                        />
                      <div className={`absolute top-2 left-2 w-6 h-6 rounded-full ${colors.badge} flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                        {card.rarity === 'common' && '⬤'}
                        {card.rarity === 'rare' && '◆'}
                        {card.rarity === 'epic' && '◈'}
                        {card.rarity === 'legendary' && '★'}
                        {card.rarity === 'mythic' && '⚜'}
                      </div>
                    </>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                      <div className="w-10 h-10 border-2 border-gray-500 rounded-full border-t-transparent animate-spin" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className={`text-sm font-bold truncate ${isRevealed ? 'text-white' : 'text-gray-600'}`}>
                    {isRevealed ? card.playerName : '???'}
                  </h4>
                  {isRevealed && (
                    <>
                      <div className="flex justify-between items-center mt-2 text-xs">
                        <span className="text-gray-400 capitalize">{card.role}</span>
                        <span className={`text-xs font-semibold ${colors.text}`}>
                          {card.rarity.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700">
                        <div className="text-center">
                          <div className="text-[10px] text-gray-500">BAT</div>
                          <div className="text-sm font-semibold text-white">{card.stats.batting}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-gray-500">BOWL</div>
                          <div className="text-sm font-semibold text-white">{card.stats.bowling}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[10px] text-gray-500">FLD</div>
                          <div className="text-sm font-semibold text-white">{card.stats.fielding}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {stage === 'complete' && (
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-emerald-800 transition shadow-lg"
            >
              Collect Cards
            </button>
          </div>
        )}
      </motion.div>
      
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};