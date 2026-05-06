// frontend/src/pages/Games/CricketCards/components/PackSelector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { packsData } from '../data/packsData';
import { PackType } from '../types/cricketCards.types';

interface PackSelectorProps {
  onOpenPack: (packType: PackType) => void;
  gems: number;
  coins: number;
}

export const PackSelector: React.FC<PackSelectorProps> = ({ onOpenPack, gems, coins }) => {
  const getPackCost = (packType: PackType) => {
    const pack = packsData.find(p => p.type === packType);
    if (!pack) return { canAfford: false, display: 'N/A', cost: 0, type: '' };
    
    if (pack.costCoins > 0) {
      return { canAfford: coins >= pack.costCoins, display: `${pack.costCoins} Coins`, cost: pack.costCoins, type: 'coins' };
    } else {
      return { canAfford: gems >= pack.costGems, display: `${pack.costGems} Gems`, cost: pack.costGems, type: 'gems' };
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-500 text-gray-400';
      case 'rare': return 'border-blue-500 text-blue-400';
      case 'epic': return 'border-purple-500 text-purple-400';
      case 'legendary': return 'border-amber-500 text-amber-400';
      case 'mythic': return 'border-red-500 text-red-400';
      default: return 'border-gray-500';
    }
  };

  const getPackGradient = (type: string) => {
    switch (type) {
      case 'standard': return 'from-gray-700 to-gray-800';
      case 'premium': return 'from-blue-900 to-slate-900';
      case 'legendary': return 'from-amber-900 to-yellow-900';
      default: return 'from-gray-700 to-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
        {packsData.map((pack, index) => {
          const { canAfford, display, type } = getPackCost(pack.type);
          
          return (
            <motion.div
              key={pack.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-gradient-to-br ${getPackGradient(pack.type)} rounded-xl overflow-hidden border-2 transition-all ${
                pack.type === 'standard' ? 'border-gray-600 hover:border-gray-500' :
                pack.type === 'premium' ? 'border-blue-500 hover:border-blue-400' :
                'border-amber-500 hover:border-amber-400'
              }`}
            >
              <div className="p-6 text-center">
                
                <h3 className="text-xl font-bold text-white mb-1">{pack.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{pack.description}</p>
                
                {/* Probabilities */}
                <div className="space-y-1.5 mb-5 bg-black/30 rounded-lg p-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Common</span>
                    <span className={getRarityColor('common')}>{Math.round(pack.probabilities.common * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Rare</span>
                    <span className={getRarityColor('rare')}>{Math.round(pack.probabilities.rare * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Epic</span>
                    <span className={getRarityColor('epic')}>{Math.round(pack.probabilities.epic * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Legendary</span>
                    <span className={getRarityColor('legendary')}>{Math.round(pack.probabilities.legendary * 100)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Mythic</span>
                    <span className={getRarityColor('mythic')}>{Math.round(pack.probabilities.mythic * 100)}%</span>
                  </div>
                </div>
                
                <div className="text-center mb-4">
                  <div className={`text-base font-bold ${
                    type === 'gems' ? 'text-yellow-400' : 'text-amber-400'
                  }`}>
                    {display}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{pack.cardCount} cards per pack</div>
                </div>
                
                <button
                  onClick={() => canAfford && onOpenPack(pack.type)}
                  disabled={!canAfford}
                  className={`w-full py-2.5 rounded-lg font-semibold transition-all ${
                    canAfford
                      ? pack.type === 'standard' ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 shadow-md' :
                        pack.type === 'premium' ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md' :
                        'bg-gradient-to-r from-amber-600 to-yellow-600 text-white hover:from-amber-700 hover:to-yellow-700 shadow-md'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Open Pack' : `Need ${display}`}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Info Box */}
      <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">How to Get Gems & Coins</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Earn KwikCric Gems and Coins by playing other games! Complete matches in Kwik Cricket, 
              answer questions in Cricket Mastermind, win as imposter, or guess players correctly. 
              Daily login rewards also give free gems and coins every day!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};