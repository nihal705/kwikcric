// frontend/src/pages/Games/CricketCards/components/ShopModal.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { purchasePackages } from '../data/purchasePackages';

interface ShopModalProps {
  onClose: () => void;
  onPurchase: (gems: number, coins: number) => void;
}

// Coin packages data
const coinPackages = [
  { id: 'coin_small', name: 'Small Coin Pack', coins: 1000, bonusCoins: 0, priceUsd: 0.99 },
  { id: 'coin_medium', name: 'Medium Coin Pack', coins: 3000, bonusCoins: 500, priceUsd: 2.99, popular: true },
  { id: 'coin_large', name: 'Large Coin Pack', coins: 8000, bonusCoins: 2000, priceUsd: 6.99 },
  { id: 'coin_mega', name: 'Mega Coin Pack', coins: 20000, bonusCoins: 8000, priceUsd: 14.99, bestValue: true },
  { id: 'coin_ultra', name: 'Ultra Coin Pack', coins: 50000, bonusCoins: 25000, priceUsd: 29.99 },
  { id: 'coin_legendary', name: 'Legendary Coin Pack', coins: 150000, bonusCoins: 100000, priceUsd: 79.99 }
];

export const ShopModal: React.FC<ShopModalProps> = ({ onClose, onPurchase }) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'gems' | 'coins'>('gems');

  const handlePurchase = (pkg: typeof purchasePackages[0] | typeof coinPackages[0], type: 'gems' | 'coins') => {
    setSelectedPackage(pkg.id);
    setTimeout(() => {
      if (type === 'gems') {
        const gemsPkg = pkg as typeof purchasePackages[0];
        onPurchase(gemsPkg.gems + gemsPkg.bonusGems, 0);
      } else {
        const coinsPkg = pkg as typeof coinPackages[0];
        onPurchase(0, coinsPkg.coins + coinsPkg.bonusCoins);
      }
      setSelectedPackage(null);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gray-900 rounded-xl p-4 max-w-5xl w-full max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
          <div>
            <h2 className="text-xl font-bold text-white">KwikCric Shop</h2>
            <p className="text-xs text-gray-400">Purchase Gems & Coins</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white text-2xl transition leading-none"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab('gems')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'gems'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>KwikCric Gems</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('coins')}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'coins'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>KwikCric Coins</span>
            </div>
          </button>
        </div>
        
        {/* Gems Packages */}
        {activeTab === 'gems' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {purchasePackages.map(pkg => (
              <div
                key={pkg.id}
                className={`relative bg-gray-800 rounded-lg p-3 border transition-all hover:scale-102 ${
                  pkg.popular ? 'border-amber-500' : pkg.bestValue ? 'border-purple-500' : 'border-gray-700'
                }`}
              >
                {(pkg.popular || pkg.bestValue) && (
                  <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                    pkg.popular ? 'bg-amber-500 text-black' : 'bg-purple-500 text-white'
                  }`}>
                    {pkg.popular ? 'POPULAR' : 'BEST VALUE'}
                  </div>
                )}
                
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mb-2 shadow-md">
                    <span className="text-lg font-bold text-white">◆</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{pkg.name}</h3>
                  <div className="text-base font-bold text-purple-400">{pkg.gems.toLocaleString()} Gems</div>
                  {pkg.bonusGems > 0 && (
                    <div className="text-[10px] text-emerald-400">+{pkg.bonusGems.toLocaleString()} Bonus</div>
                  )}
                  <div className="text-base font-semibold text-white my-2">${pkg.priceUsd}</div>
                  <button
                    onClick={() => handlePurchase(pkg, 'gems')}
                    disabled={selectedPackage === pkg.id}
                    className="w-full py-1.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-semibold hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50 shadow-sm"
                  >
                    {selectedPackage === pkg.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Processing...</span>
                      </div>
                    ) : (
                      'Purchase'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Coins Packages */}
        {activeTab === 'coins' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
            {coinPackages.map(pkg => (
              <div
                key={pkg.id}
                className={`relative bg-gray-800 rounded-lg p-3 border transition-all hover:scale-102 ${
                  pkg.popular ? 'border-amber-500' : pkg.bestValue ? 'border-orange-500' : 'border-gray-700'
                }`}
              >
                {(pkg.popular || pkg.bestValue) && (
                  <div className={`absolute -top-2 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${
                    pkg.popular ? 'bg-amber-500 text-black' : 'bg-orange-500 text-white'
                  }`}>
                    {pkg.popular ? 'POPULAR' : 'BEST VALUE'}
                  </div>
                )}
                
                <div className="text-center">
                  <div className="w-10 h-10 mx-auto bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center mb-2 shadow-md">
                    <span className="text-lg font-bold text-white">¢</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{pkg.name}</h3>
                  <div className="text-base font-bold text-amber-400">{pkg.coins.toLocaleString()} Coins</div>
                  {pkg.bonusCoins > 0 && (
                    <div className="text-[10px] text-emerald-400">+{pkg.bonusCoins.toLocaleString()} Bonus</div>
                  )}
                  <div className="text-base font-semibold text-white my-2">${pkg.priceUsd}</div>
                  <button
                    onClick={() => handlePurchase(pkg, 'coins')}
                    disabled={selectedPackage === pkg.id}
                    className="w-full py-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-sm font-semibold hover:from-amber-700 hover:to-amber-800 transition disabled:opacity-50 shadow-sm"
                  >
                    {selectedPackage === pkg.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs">Processing...</span>
                      </div>
                    ) : (
                      'Purchase'
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Info Box */}
        <div className="mt-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-white mb-0.5">About KwikCric Currency</h4>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                <span className="text-purple-400">Gems</span> - Premium currency for Premium and Legendary packs. 
                <span className="text-amber-400 ml-2">Coins</span> - Base currency for Standard packs and daily rewards.
                Earn both currencies for free by playing other games and completing daily login rewards!
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};