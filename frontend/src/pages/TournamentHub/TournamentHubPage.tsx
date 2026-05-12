// frontend/src/pages/TournamentHub/TournamentHubPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TournamentCard } from './components/TournamentCard';
import { ChampionsGrid } from './components/ChampionsGrid';
import { TournamentStats } from './components/TournamentStats';

type TournamentType = 'odi' | 't20' | 'ct' | 'wtc';

const odiStats = { mostWins: 'Australia (6)', mostRuns: 'Sachin Tendulkar', mostWickets: 'Glenn McGrath' };
const t20Stats = { mostWins: 'India (3)', mostRuns: 'Virat Kohli', mostWickets: 'Shakib Al Hasan' };
const ctStats = { mostWins: 'India (3)', mostRuns: 'Chris Gayle', mostWickets: 'Kyle Mills' };
const wtcStats = { mostWins: 'NZ, AUS, SA (1 each)', mostPoints: 'South Africa', mostSeries: 'India (2 finals)' };

const TournamentHubPage: React.FC = () => {
  const [selectedTournament, setSelectedTournament] = useState<TournamentType>('odi');

  const cards = [
    {
      id: 'odi' as const,
      name: 'ODI World Cup',
      icon: '',
      color: 'from-green-500 to-green-700',
      years: '1975 - 2026',
      editions: 13,
      link: '/world-cup',
      stats: odiStats
    },
    {
      id: 't20' as const,
      name: 'T20 World Cup',
      icon: '',
      color: 'from-purple-500 to-pink-500',
      years: '2007 - 2026',
      editions: 10,
      link: '/world-cup/t20',
      stats: t20Stats
    },
    {
      id: 'ct' as const,
      name: 'Champions Trophy',
      icon: '',
      color: 'from-blue-500 to-cyan-500',
      years: '1998 - 2025',
      editions: 9,
      link: '/champions-trophy',
      stats: ctStats
    },
    {
      id: 'wtc' as const,
      name: 'World Test Championship',
      icon: '',
      color: 'from-red-500 to-rose-500',
      years: '2019 - Present',
      editions: 3,
      link: '/wtc',
      stats: wtcStats
    },
  ];

  return (
    <div 
  className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" 
  style={{ backgroundImage: 'none' }}
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Compact */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Tournament Hub</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">Explore all major ICC cricket tournaments</p>
          </motion.div>
        </div>
        
        {/* Tournament Cards - Compact Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map((card) => (
            <TournamentCard
              key={card.id}
              id={card.id}
              name={card.name}
              icon={card.icon}
              color={card.color}
              years={card.years}
              editions={card.editions}
              isActive={selectedTournament === card.id}
              onClick={() => setSelectedTournament(card.id)}
              link={card.link}
              stats={card.stats}
            />
          ))}
        </div>
        
        {/* Champions Grid - Compact */}
        <ChampionsGrid tournamentType={selectedTournament} />
        
        {/* Tournament Stats - Compact */}
        <TournamentStats tournamentType={selectedTournament} />
      </div>
    </div>
  );
};

export default TournamentHubPage;