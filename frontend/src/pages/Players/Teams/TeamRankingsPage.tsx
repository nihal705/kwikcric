// src/pages/Teams/TeamRankingsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface TeamRanking {
  rank: number;
  team_name: string;
  team_id: number;
  short_code: string;
  world_cup_wins: number;
  t20_world_cup_wins: number;
  champions_trophy_wins: number;
  win_percentage: number;
  rating: number;
}

const TeamRankingsPage: React.FC = () => {
  const [format, setFormat] = useState<'overall' | 'odi' | 't20' | 'test'>('overall');
  const [rankings, setRankings] = useState<TeamRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRankings();
  }, [format]);

  const fetchRankings = async () => {
  setLoading(true);
  try {
    const response = await axios.get(`http://localhost:3000/api/team-rankings/${format.toLowerCase()}?limit=50`);
    let allTeams = response.data.data || [];
    
    if (format === 't20') {
      allTeams = allTeams.map((team: any) => {
        if (team.team_name === 'India' || team.team_id === 1 || team.short_code === 'IND') {
          return { ...team, t20_world_cup_wins: 3 };
        }
        return team;
      });
    }

    if (format === 'overall') {
      allTeams = allTeams.map((team: any) => {
        if (team.team_name === 'India' || team.team_id === 1 || team.short_code === 'IND') {
          return { ...team, t20_world_cup_wins: 3 };
        }
        return team;
      });
    }
    
    if (format === 'odi') {
      allTeams = allTeams.map((team: any) => {
        if (team.team_name === 'Australia' || team.team_id === 2 || team.short_code === 'AUS') {
          return { ...team, world_cup_wins: 6 };
        }
        return team;
      });
    }

    if (format === 'overall') {
      allTeams = allTeams.map((team: any) => {
        if (team.team_name === 'Australia' || team.team_id === 2 || team.short_code === 'AUS') {
          return { ...team, world_cup_wins: 6 };
        }
        return team;
      });
    }
    
    setRankings(allTeams);
  } catch (error) {
    console.error('Error fetching team rankings:', error);
    toast.error('Failed to load team rankings');
    setRankings([]);
  } finally {
    setLoading(false);
  }
};

  const getMedalText = (rank: number) => {
    if (rank === 1) return '1';
    if (rank === 2) return '2';
    if (rank === 3) return '3';
    return `${rank}`;
  };

  const getMedalBgColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-500 dark:bg-yellow-600';
    if (rank === 2) return 'bg-gray-400 dark:bg-gray-500';
    if (rank === 3) return 'bg-amber-600 dark:bg-amber-700';
    return 'bg-gray-700 dark:bg-gray-800';
  };

  const formatsList = [
    { id: 'overall', name: 'OVERALL', bgColor: 'bg-purple-600 dark:bg-purple-900' },
    { id: 'odi', name: 'ODI', bgColor: 'bg-blue-600 dark:bg-blue-900' },
    { id: 't20', name: 'T20', bgColor: 'bg-green-600 dark:bg-green-900' },
    { id: 'test', name: 'TEST', bgColor: 'bg-red-600 dark:bg-red-900' },
  ];

  const filteredRankings = rankings.filter(team =>
    team.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get trophy stats based on selected format
  const getTrophyStats = (team: TeamRanking) => {
    switch (format) {
      case 'odi':
        return [
          { label: 'WC', value: team.world_cup_wins || 0 },
          { label: 'CT', value: team.champions_trophy_wins || 0 }
        ];
      case 't20':
        return [
          { label: 'T20 WC', value: team.t20_world_cup_wins || 0 }
        ];
      case 'test':
        return []; // No trophies for Test
      default: // overall
        return [
          { label: 'WC', value: team.world_cup_wins || 0 },
          { label: 'T20 WC', value: team.t20_world_cup_wins || 0 },
          { label: 'CT', value: team.champions_trophy_wins || 0 }
        ];
    }
  };

  return (
     <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" style={{ backgroundImage: 'none' }}>
      {/* Hero Section */}
      <div className={`relative bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-900 dark:to-blue-900 py-16`}>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Team Rankings
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Discover the greatest cricket teams of all time across all formats
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Format Selector */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {formatsList.map((f) => (
            <button
              key={f.id}
              onClick={() => setFormat(f.id as any)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all transform
                ${format === f.id 
                  ? `${f.bgColor} text-white shadow-lg scale-105` 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              disabled={loading}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Rankings Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredRankings.map((team) => {
              const trophyStats = getTrophyStats(team);
              return (
                <Link to={`/tournaments/hub?format=${format.toLowerCase()}&team=${team.team_name}`} key={team.team_id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200 dark:border-gray-700"
                  >
                    {/* Rank Badge */}
                    <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${getMedalBgColor(team.rank)} shadow-lg`}>
                      {getMedalText(team.rank)}
                    </div>

                    {/* Header */}
                    <div className={`h-24 bg-gradient-to-r ${team.rank === 1 ? 'from-yellow-700 to-yellow-500 dark:from-yellow-900 dark:to-yellow-700' : 'from-blue-700 to-purple-700 dark:from-blue-900 dark:to-purple-900'} relative`}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-white">
                          {team.short_code}
                        </div>
                        <div className="text-xs text-white/70 mt-1">Rank #{team.rank}</div>
                      </div>
                    </div>

                    {/* Team Info */}
                    <div className="p-4">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3 text-center truncate">
                        {team.team_name}
                      </h3>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">{team.win_percentage}%</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Win Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{team.rating}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                        </div>
                      </div>

                      {/* Trophy Count - Conditionally shown based on format */}
                      {trophyStats.length > 0 && (
                        <div className="flex justify-around pt-2 border-t border-gray-200 dark:border-gray-700">
                          {trophyStats.map((stat) => (
                            <div key={stat.label} className="text-center">
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRankings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No teams found</p>
          </div>
        )}

        {/* Stats Summary - Also conditionally update */}
        {!loading && rankings.length > 0 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xl font-bold text-gray-900 dark:text-white">{rankings.length}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Teams Ranked</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {format === 'odi' 
                  ? rankings.filter(t => t.world_cup_wins > 0).length
                  : format === 't20' 
                  ? rankings.filter(t => t.t20_world_cup_wins > 0).length
                  : rankings.filter(t => t.world_cup_wins > 0).length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format === 'odi' ? 'WC Winners' : format === 't20' ? 'T20 WC Winners' : 'WC Winners'}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {format === 't20' 
                  ? rankings.filter(t => t.t20_world_cup_wins > 0).length
                  : rankings.filter(t => t.t20_world_cup_wins > 0).length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format === 't20' ? 'T20 WC' : 'T20 WC'}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {rankings.reduce((sum, t) => {
                  if (format === 'odi') return sum + t.world_cup_wins + t.champions_trophy_wins;
                  if (format === 't20') return sum + t.t20_world_cup_wins;
                  if (format === 'test') return 0;
                  return sum + t.world_cup_wins + t.t20_world_cup_wins + t.champions_trophy_wins;
                }, 0)}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {format === 'test' ? 'N/A' : 'Total Cups'}
              </div>
            </div>
          </div>
        )}

        {/* Info Note */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          Rankings based on {format === 'odi' ? 'ODI World Cup wins, Champions Trophy wins' : format === 't20' ? 'T20 World Cup wins' : format === 'test' ? 'win percentage and rating' : 'World Cup wins, T20 World Cup wins, Champions Trophy wins'} and win percentage
        </div>
      </div>
    </div>
  );
};

export default TeamRankingsPage;