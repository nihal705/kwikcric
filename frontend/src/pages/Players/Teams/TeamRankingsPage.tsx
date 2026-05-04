// src/pages/Teams/TeamRankingsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  FaTrophy, 
  FaShieldAlt, 
  FaBolt, 
  FaCrown, 
  FaSearch, 
  FaChartLine,
  FaGlobe,
  FaStar
} from 'react-icons/fa';

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
      const response = await axios.get(`http://localhost:3000/api/team-rankings/${format}?limit=30`);
      setRankings(response.data.data);
    } catch (error) {
      console.error('Error fetching team rankings:', error);
      toast.error('Failed to load team rankings');
      // Fallback data
      setRankings([
        { rank: 1, team_name: 'Australia', team_id: 1, short_code: 'AUS', world_cup_wins: 5, t20_world_cup_wins: 1, champions_trophy_wins: 2, win_percentage: 62.3, rating: 824.6 },
        { rank: 2, team_name: 'India', team_id: 2, short_code: 'IND', world_cup_wins: 2, t20_world_cup_wins: 2, champions_trophy_wins: 2, win_percentage: 58.5, rating: 597.0 },
        { rank: 3, team_name: 'West Indies', team_id: 3, short_code: 'WI', world_cup_wins: 2, t20_world_cup_wins: 2, champions_trophy_wins: 1, win_percentage: 53.5, rating: 527.0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <FaCrown className="text-yellow-500 text-2xl" />;
    if (rank === 2) return <FaTrophy className="text-gray-400 text-xl" />;
    if (rank === 3) return <FaTrophy className="text-amber-600 text-xl" />;
    return <span className="text-lg font-bold text-white">{rank}</span>;
  };

  const formatsList = [
    { id: 'overall', name: 'Overall', icon: <FaCrown />, color: 'from-purple-600 to-purple-700' },
    { id: 'odi', name: 'ODI', icon: <FaGlobe />, color: 'from-blue-600 to-blue-700' },
    { id: 't20', name: 'T20I', icon: <FaBolt />, color: 'from-green-600 to-green-700' },
    { id: 'test', name: 'Test', icon: <FaShieldAlt />, color: 'from-red-600 to-red-700' },
  ];

  const filteredRankings = rankings.filter(team =>
    team.team_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-900 to-blue-900 py-16">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <FaTrophy className="text-5xl text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Team Rankings
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
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
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform
                ${format === f.id 
                  ? `bg-gradient-to-r ${f.color} text-white shadow-lg scale-105` 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              disabled={loading}
            >
              {f.icon}
              <span>{f.name}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search team..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Rankings Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRankings.map((team) => (
              <Link to={`/team/${team.team_id}`} key={team.team_id}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                >
                  {/* Rank Badge */}
                  <div className={`absolute top-4 left-4 w-12 h-12 rounded-full flex items-center justify-center
                    ${team.rank === 1 ? 'bg-yellow-500' :
                      team.rank === 2 ? 'bg-gray-400' :
                      team.rank === 3 ? 'bg-amber-600' :
                      'bg-gray-700'}`}>
                    {getMedalIcon(team.rank)}
                  </div>

                  {/* Header */}
                  <div className={`h-32 bg-gradient-to-r ${team.rank === 1 ? 'from-yellow-800 to-yellow-600' : 'from-blue-800 to-purple-800'} relative`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-white">
                        {team.short_code}
                      </div>
                      <div className="text-sm text-gray-300 mt-1">ICC Ranking #{team.rank}</div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 text-center">
                      {team.team_name}
                    </h3>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{team.win_percentage}%</div>
                        <div className="text-xs text-gray-400">Win Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{team.rating}</div>
                        <div className="text-xs text-gray-400">Rating</div>
                      </div>
                    </div>

                    {/* Trophy Count */}
                    <div className="flex justify-around pt-3 border-t border-gray-700">
                      <div className="text-center">
                        <FaTrophy className="text-yellow-500 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-white">{team.world_cup_wins || 0}</div>
                        <div className="text-xs text-gray-400">World Cups</div>
                      </div>
                      <div className="text-center">
                        <FaBolt className="text-green-500 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-white">{team.t20_world_cup_wins || 0}</div>
                        <div className="text-xs text-gray-400">T20 WC</div>
                      </div>
                      <div className="text-center">
                        <FaShieldAlt className="text-purple-500 mx-auto mb-1" />
                        <div className="text-sm font-semibold text-white">{team.champions_trophy_wins || 0}</div>
                        <div className="text-xs text-gray-400">Champions</div>
                      </div>
                    </div>

                    {/* Rating Bar */}
                    <div className="mt-4">
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, (team.rating / 1000) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaChartLine className="text-blue-400 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-400">{rankings.length}</div>
            <div className="text-gray-400 text-sm">Teams Ranked</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaTrophy className="text-yellow-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-500">
              {rankings.filter(t => t.world_cup_wins > 0).length}
            </div>
            <div className="text-gray-400 text-sm">World Cup Winners</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaBolt className="text-green-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-500">
              {rankings.filter(t => t.t20_world_cup_wins > 0).length}
            </div>
            <div className="text-gray-400 text-sm">T20 WC Winners</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <FaStar className="text-purple-500 text-2xl mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-500">
              {rankings.reduce((sum, t) => sum + t.world_cup_wins + t.t20_world_cup_wins + t.champions_trophy_wins, 0)}
            </div>
            <div className="text-gray-400 text-sm">Total Trophies</div>
          </div>
        </div>

        {/* Info Note */}
        <div className="mt-8 text-center text-xs text-gray-500">
          Rankings are calculated based on World Cup wins, T20 World Cup wins, Champions Trophy wins, and overall win percentage.<br />
          Data includes all international matches and major tournaments.
        </div>
      </div>
    </div>
  );
};

export default TeamRankingsPage;