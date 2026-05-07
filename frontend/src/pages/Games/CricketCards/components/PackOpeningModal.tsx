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

  // Get rarity frame class (same as CardComponent)
  const getRarityFrameClass = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'card-frame-mythic';
      case 'legendary': return 'card-frame-legendary';
      case 'elite': return 'card-frame-elite';
      case 'epic': return 'card-frame-epic';
      case 'rare': return 'card-frame-rare';
      case 'standard': return 'card-frame-standard';
      default: return 'card-frame-common';
    }
  };

  // Get rarity background color (same as CardComponent)
  const getRarityBgColor = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'from-red-950/80 via-purple-950/80 to-blue-950/80';
      case 'legendary': return 'from-amber-950/80 to-yellow-950/80';
      case 'elite': return 'from-cyan-950/80 to-teal-950/80';
      case 'epic': return 'from-purple-950/80 to-fuchsia-950/80';
      case 'rare': return 'from-blue-950/80 to-cyan-950/80';
      case 'standard': return 'from-slate-800/80 to-gray-800/80';
      default: return 'from-gray-800 to-gray-900';
    }
  };

  // Get rarity badge background (same as CardComponent)
  const getRarityBadgeBg = (rarity: string) => {
    switch (rarity) {
      case 'mythic': return 'bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500';
      case 'legendary': return 'bg-gradient-to-r from-yellow-500 to-amber-600';
      case 'elite': return 'bg-gradient-to-r from-cyan-500 to-teal-600';
      case 'epic': return 'bg-gradient-to-r from-purple-500 to-fuchsia-600';
      case 'rare': return 'bg-gradient-to-r from-blue-500 to-cyan-600';
      case 'standard': return 'bg-gradient-to-r from-slate-500 to-gray-600';
      default: return 'bg-gray-500';
    }
  };

  // Get rarity badge symbol (same as CardComponent)
  const getRarityBadgeSymbol = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⬤';
      case 'standard': return '⬟';
      case 'rare': return '◆';
      case 'epic': return '◈';
      case 'elite': return '✧';
      case 'legendary': return '★';
      case 'mythic': return '✦';
      default: return '';
    }
  };

  useEffect(() => {
    soundService.playPackShake();
    
    const timer1 = setTimeout(() => {
      setStage('opening');
      soundService.playPackOpen();
    }, 1500);
    
    const timer2 = setTimeout(() => {
      setStage('revealing');
      
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
            const frameClass = getRarityFrameClass(card.rarity);
            const bgColorClass = getRarityBgColor(card.rarity);
            const badgeBgClass = getRarityBadgeBg(card.rarity);
            const badgeSymbol = getRarityBadgeSymbol(card.rarity);
            
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                animate={isRevealed ? { opacity: 1, scale: 1, rotateY: 0 } : { opacity: 0.3, scale: 0.8, rotateY: 90 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative rounded-xl overflow-hidden ${frameClass}`}
              >
                {/* Elite diamond */}
                {card.rarity === 'elite' && isRevealed && (
                  <div className="elite-diamond" />
                )}
                
                {/* Legendary-specific elements */}
                {card.rarity === 'legendary' && isRevealed && (
                  <>
                    <div className="legendary-glow" />
                    <div className="legendary-crown" />
                    <div className="legendary-gems">
                      <span /> <span /> <span /> <span /> <span />
                    </div>
                  </>
                )}
                
                {/* Mythic-specific elements */}
                {card.rarity === 'mythic' && isRevealed && (
                  <>
                    <div className="mythic-holo" />
                    <div className="mythic-stars">
                      <span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span><span>✦</span>
                    </div>
                    <div className="mythic-dragon" />
                  </>
                )}
                
                {/* Epic corners */}
                {card.rarity === 'epic' && isRevealed && (
                  <>
                    <div className="card-corner card-corner-tl" />
                    <div className="card-corner card-corner-tr" />
                    <div className="card-corner card-corner-bl" />
                    <div className="card-corner card-corner-br" />
                  </>
                )}
                
                {/* Card Art Section */}
                <div className={`aspect-square bg-gradient-to-br ${bgColorClass} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    {isRevealed ? (
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
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
                        <div className="w-10 h-10 border-2 border-gray-500 rounded-full border-t-transparent animate-spin" />
                      </div>
                    )}
                  </div>
                  
                  {/* Rarity Badge */}
                  {isRevealed && (
                    <div className={`absolute top-2 left-2 w-6 h-6 rounded-full ${badgeBgClass} flex items-center justify-center text-xs font-bold text-white shadow-lg z-10`}>
                      {badgeSymbol}
                    </div>
                  )}
                  
                  {/* Card Rarity Display */}
                  {isRevealed && (
                    <div className="absolute top-2 right-2">
                      <h3 className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded-full">
                        {card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1)}
                      </h3>
                    </div>
                  )}
                  
                  {/* Card Version Ribbon */}
                  {isRevealed && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-1 text-center">
                      <span className="text-[8px] text-gray-300">{card.cardVersion}</span>
                    </div>
                  )}
                </div>
                
                {/* Card Info */}
                <div className="p-3">
                  <h4 className={`text-sm font-bold truncate text-center ${isRevealed ? 'text-white' : 'text-gray-600'}`}>
                    {isRevealed ? card.playerName : '???'}
                  </h4>
                  
                  {isRevealed && (
                    <>
                      {/* Stars */}
                      <div className="flex justify-center items-center gap-0.5 mt-1">
                        {Array.from({ length: 
                          card.rarity === 'common' ? 1 : 
                          card.rarity === 'standard' ? 2 :
                          card.rarity === 'rare' ? 2 : 
                          card.rarity === 'epic' ? 3 : 
                          card.rarity === 'elite' ? 4 :
                          card.rarity === 'legendary' ? 4 : 5 
                        }).map((_, i) => (
                          <span key={i} className={`text-[10px] ${colors.text}`}>★</span>
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