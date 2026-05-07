// frontend/src/pages/Games/CricketCards/CricketCardsPage.tsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { CardGrid } from './components/CardGrid';
import { PackSelector } from './components/PackSelector';
import { CollectionStats } from './components/CollectionStats';
import { CardFilters } from './components/CardFilters';
import { DailyRewards } from './components/DailyRewards';
import { AchievementsPanel } from './components/AchievementsPanel';
import { PackOpeningModal } from './components/PackOpeningModal';
import { CardDetailModal } from './components/CardDetailModal';
import { ShopModal } from './components/ShopModal';
import { useCardCollection } from './hooks/useCardCollection';
import { useCurrency } from './hooks/useCurrency';
import { useDailyRewards } from './hooks/useDailyRewards';
import { useAchievements } from './hooks/useAchievements';
import { Card, PackType, Rarity } from './types/cricketCards.types';
import { packsData } from './data/packsData';
import { openPack as openPackService } from './services/cardAPI';
import './styles/cards.css';

type TabType = 'collection' | 'packs' | 'sets' | 'achievements';

const CricketCardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('collection');
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isPackOpening, setIsPackOpening] = useState(false);
  const [selectedPackType, setSelectedPackType] = useState<PackType | null>(null);
  const [pendingPackCards, setPendingPackCards] = useState<Card[]>([]);
  const [showShop, setShowShop] = useState(false);
  const [showDailyRewards, setShowDailyRewards] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRarity, setSelectedRarity] = useState<Rarity | 'all'>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  
  const { ownedCards, collectionStats, addToFavorites, removeFromFavorites, loadCards, addCard } = useCardCollection();
  const { currency, addCurrency, spendCurrency, loadCurrency } = useCurrency();
  const { rewards: dailyRewards, streak, claimReward } = useDailyRewards();
  const { achievements, updateProgress, checkAchievements } = useAchievements();

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

useEffect(() => {
  const init = async () => {
    await loadCurrency();
    await loadCards();
    
    // Check if daily rewards should be shown
    const saved = localStorage.getItem('cricket_cards_daily');
    const today = new Date().toDateString();
    let shouldShowDaily = false;
    
    if (saved) {
      const data = JSON.parse(saved);
      // Only show if last claim date is not today
      if (data.lastClaimDate !== today) {
        shouldShowDaily = true;
      }
    } else {
      // No data yet, first time user
      shouldShowDaily = true;
    }
    
    if (shouldShowDaily) {
      setShowDailyRewards(true);
    }
  };
  init();
}, []);

  // Listen for theme changes from navbar
  useEffect(() => {
    const checkTheme = () => {
      const htmlElement = document.documentElement;
      const themeAttr = htmlElement.getAttribute('data-theme');
      setTheme(themeAttr === 'light' ? 'light' : 'dark');
    };
    
    // Check initial theme
    checkTheme();
    
    // Create observer to watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          checkTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  const handleOpenPack = async (packType: PackType) => {
    console.log('Opening pack:', packType);
    
    // Find the pack
    const pack = packsData.find(p => p.type === packType);
    if (!pack) {
      console.error('Pack not found:', packType);
      alert('Pack not found!');
      return;
    }
    
    console.log('Pack details:', pack);
    console.log('Current currency:', currency);
    
    // Check if user can afford
    if (pack.costCoins > 0 && currency.coins < pack.costCoins) {
      alert(`Need ${pack.costCoins} KwikCric Coins to open this pack! You have ${currency.coins} coins.`);
      return;
    }
    if (pack.costGems > 0 && currency.gems < pack.costGems) {
      alert(`Need ${pack.costGems} KwikCric Gems to open this pack! You have ${currency.gems} gems.`);
      return;
    }
    
    // Deduct currency
    let success = false;
    if (pack.costCoins > 0) {
      console.log('Spending coins:', pack.costCoins);
      success = await spendCurrency(pack.costCoins, 0);
    } else {
      console.log('Spending gems:', pack.costGems);
      success = await spendCurrency(0, pack.costGems);
    }
    
    console.log('Currency deduction success:', success);
    
    if (!success) {
      console.error('Failed to deduct currency!');
      alert('Failed to deduct currency! Please try again.');
      return;
    }
    
    // Open the pack and get cards
    const openedCards = await openPackService(packType);
    console.log('Cards received:', openedCards.length);
    
    // Add cards to collection
    openedCards.forEach(card => {
      addCard(card);
    });
    
    // Update achievements
    updateProgress('first_pack', 1);
    updateProgress('open_10_packs', 1);
    updateProgress('open_100_packs', 1);
    
    // Check for legendary/mythic cards
    const hasLegendary = openedCards.some(card => card.rarity === 'legendary');
    const hasMythic = openedCards.some(card => card.rarity === 'mythic');
    
    if (hasLegendary) updateProgress('legendary_card', 1);
    if (hasMythic) updateProgress('mythic_card', 1);
    
    // Update collection achievements
    const uniqueCardsCount = ownedCards.length + openedCards.filter(
      card => !ownedCards.some(c => c.id === card.id)
    ).length;
    
    if (uniqueCardsCount >= 10) updateProgress('collect_10', 10);
    if (uniqueCardsCount >= 50) updateProgress('collect_50', 50);
    if (uniqueCardsCount >= 100) updateProgress('collect_100', 100);
    
    await checkAchievements();
    
    // Store cards and show modal
    setPendingPackCards(openedCards);
    setSelectedPackType(packType);
    setIsPackOpening(true);
  };

  const handlePackClosed = async () => {
    setIsPackOpening(false);
    setSelectedPackType(null);
    setPendingPackCards([]);
    // Reload cards to update the collection view
    await loadCards();
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const handleToggleFavorite = (cardId: number) => {
    const card = ownedCards.find(c => c.id === cardId);
    if (card?.isFavorite) {
      removeFromFavorites(cardId);
    } else {
      addToFavorites(cardId);
    }
  };

  const filteredCards = ownedCards.filter(card => {
    if (searchQuery && !card.playerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedRarity !== 'all' && card.rarity !== selectedRarity) return false;
    if (selectedRole !== 'all' && card.role !== selectedRole) return false;
    if (selectedCountry !== 'all' && card.country !== selectedCountry) return false;
    if (showFavoritesOnly && !card.isFavorite) return false;
    return true;
  });

  const handleClaimDailyReward = async (day: number) => {
    const reward = await claimReward(day);
    if (reward) {
      await addCurrency(reward.coins, reward.gems);
      if (reward.freePack) {
        await handleOpenPack('standard');
      }
    }
  };

  // Get sets from collectionStats
  const sets = (collectionStats as any).sets || [];

    // Apply theme class to container
  const containerClass = `cricket-cards-container min-h-screen ${theme === 'light' ? 'theme-light' : 'theme-dark'}`;

  return (
    <div className={containerClass}>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Header 
        gems={currency.gems} 
        coins={currency.coins} 
        onShopClick={() => setShowShop(true)}
        onDailyClick={() => setShowDailyRewards(true)}
        onAchievementsClick={() => setShowAchievements(true)}
      />
      
      <div className="max-w-7xl mx-auto px-3 py-4">
        {/* Tabs */}
        <div className="flex gap-1 mb-4 border-b border-gray-700 overflow-x-auto">
          <button
            onClick={() => setActiveTab('collection')}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'collection'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            My Collection
          </button>
          <button
            onClick={() => setActiveTab('packs')}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'packs'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Open Packs
          </button>
          <button
            onClick={() => setActiveTab('sets')}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'sets'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Collection Sets
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === 'achievements'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Achievements
          </button>
        </div>

        {/* Collection Tab */}
        {activeTab === 'collection' && (
          <>
            <CollectionStats stats={collectionStats} />
            <CardFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedRarity={selectedRarity}
              onRarityChange={setSelectedRarity}
              selectedRole={selectedRole}
              onRoleChange={setSelectedRole}
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
              showFavoritesOnly={showFavoritesOnly}
              onFavoritesToggle={() => setShowFavoritesOnly(!showFavoritesOnly)}
            />
            <CardGrid 
              cards={filteredCards} 
              onCardClick={handleCardClick}
              onToggleFavorite={handleToggleFavorite}
            />
          </>
        )}

        {/* Packs Tab */}
        {activeTab === 'packs' && (
          <PackSelector onOpenPack={handleOpenPack} gems={currency.gems} coins={currency.coins} />
        )}

        {/* Sets Tab */}
        {activeTab === 'sets' && (
          <div className="space-y-3">
            {sets.length > 0 ? (
              sets.map((set: { id: number; name: string; description: string; progress: number; totalCards: number; bonusPoints: number }) => (
                <div key={set.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex flex-wrap justify-between items-center gap-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-white">{set.name}</h3>
                      <p className="text-xs text-gray-400">{set.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-yellow-500">{set.progress}/{set.totalCards}</div>
                      <div className="text-[10px] text-gray-500">Bonus: {set.bonusPoints}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div 
                      className="bg-gradient-to-r from-yellow-500 to-amber-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(set.progress / set.totalCards) * 100}%` }}
                    />
                  </div>
                  {set.progress === set.totalCards && set.totalCards > 0 && (
                    <div className="mt-1 text-right">
                      <span className="text-[10px] text-green-400 font-semibold">✓ Complete!</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 text-center border border-gray-700">
                <div className="text-3xl mb-2">🏆</div>
                <h3 className="text-sm font-semibold text-white mb-1">No Sets Available</h3>
                <p className="text-xs text-gray-400">Open packs to start collecting sets!</p>
              </div>
            )}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <AchievementsPanel
            achievements={achievements}
            onClose={() => setActiveTab('collection')}
          />
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedCard && (
          <CardDetailModal 
            card={selectedCard} 
            onClose={() => setSelectedCard(null)}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isPackOpening && selectedPackType && (
          <PackOpeningModal 
            packType={selectedPackType}
            cards={pendingPackCards}
            onClose={handlePackClosed}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showShop && (
          <ShopModal 
            onClose={() => setShowShop(false)}
            onPurchase={async (gems) => {
              await addCurrency(0, gems);
              setShowShop(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDailyRewards && (
          <DailyRewards
            rewards={dailyRewards}
            streak={streak}
            onClaim={handleClaimDailyReward}
            onClose={() => setShowDailyRewards(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAchievements && (
          <AchievementsPanel
            achievements={achievements}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </AnimatePresence>
    </div>
    </div>
  );
};

export default CricketCardsPage;