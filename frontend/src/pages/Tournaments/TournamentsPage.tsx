// src/pages/Tournaments/TournamentsPage.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaTrophy, FaBaseballBall,  FaCalendarAlt, FaFlagCheckered } from 'react-icons/fa';

interface TournamentWinner {
  team_name: string;
  year?: number;
  wins?: number;
}

const TournamentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'worldcup' | 't20wc' | 'champions'>('worldcup');
  const [winners, setWinners] = useState<TournamentWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
  }, [activeTab]);

  const fetchWinners = async () => {
    setLoading(true);
    try {
      let url = '';
      if (activeTab === 'worldcup') {
        url = 'http://localhost:3000/api/tournaments/world-cup/winners';
      } else if (activeTab === 't20wc') {
        url = 'http://localhost:3000/api/tournaments/t20-world-cup/winners';
      } else {
        url = 'http://localhost:3000/api/tournaments/champions-trophy/winners';
      }
      
      const response = await axios.get(url);
      setWinners(response.data.data);
    } catch (error) {
      console.error('Error fetching tournament winners:', error);
      // Fallback data
      if (activeTab === 'worldcup') {
        setWinners([
          { team_name: 'Australia', wins: 5 },
          { team_name: 'India', wins: 2 },
          { team_name: 'West Indies', wins: 2 },
          { team_name: 'England', wins: 1 },
          { team_name: 'Pakistan', wins: 1 },
          { team_name: 'Sri Lanka', wins: 1 },
        ]);
      } else if (activeTab === 't20wc') {
        setWinners([
          { team_name: 'India', wins: 2 },
          { team_name: 'England', wins: 2 },
          { team_name: 'West Indies', wins: 2 },
          { team_name: 'Australia', wins: 1 },
          { team_name: 'Pakistan', wins: 1 },
          { team_name: 'Sri Lanka', wins: 1 },
        ]);
      } else {
        setWinners([
          { team_name: 'India', wins: 2 },
          { team_name: 'Australia', wins: 2 },
          { team_name: 'England', wins: 1 },
          { team_name: 'Pakistan', wins: 1 },
          { team_name: 'Sri Lanka', wins: 1 },
          { team_name: 'West Indies', wins: 1 },
          { team_name: 'New Zealand', wins: 1 },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'worldcup', name: 'ODI World Cup', icon: <FaTrophy /> },
    { id: 't20wc', name: ' T20I World Cup', icon: <FaBaseballBall /> },
    { id: 'champions', name: ' Champions Trophy', icon: <FaFlagCheckered /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-yellow-900 to-red-900 py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <FaTrophy className="text-5xl text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cricket Tournaments
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Explore the history of major cricket tournaments and their champions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform
                ${activeTab === tab.id 
                  ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white shadow-lg scale-105' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Winners Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {winners.map((winner, idx) => (
              <div key={idx} className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className={`h-2 ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-amber-600' : 'bg-blue-500'}`} />
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🏆'}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{winner.team_name}</h3>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <FaTrophy className="text-yellow-500" />
                    <span>{winner.wins || winner.year || 'Champion'}</span>
                    {(winner.wins !== undefined && winner.wins > 1) && <span>Wins</span>}
                  </div>
                  {idx === 0 && (
                    <div className="mt-3 text-sm text-yellow-500">Most Successful Team</div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaTrophy className="text-yellow-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{winners.length}</div>
            <div className="text-gray-400 text-sm">Champion Teams</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaCalendarAlt className="text-blue-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">
              {activeTab === 'worldcup' ? '13' : activeTab === 't20wc' ? '9' : '8'}
            </div>
            <div className="text-gray-400 text-sm">Tournaments Held</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaFlagCheckered className="text-green-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">1975-Present</div>
            <div className="text-gray-400 text-sm">History Span</div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 text-center text-xs text-gray-500">
          Data includes all ICC World Cups, T20 World Cups, and Champions Trophy tournaments.<br />
          Most successful teams are ranked by total championships won.
        </div>
      </div>
    </div>
  );
};

export default TournamentsPage;