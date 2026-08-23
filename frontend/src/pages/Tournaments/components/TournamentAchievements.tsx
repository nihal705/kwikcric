import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../services/api/config';

interface Achievement {
  achievement_type: string;
  title: string;
  description: string;
  is_featured: boolean;
  players: string[];
}

interface TournamentAchievementsProps {
  tournamentId: number;
  year: number;
  tournamentType?: string;
}

export const TournamentAchievements: React.FC<TournamentAchievementsProps> = ({ tournamentId}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, [tournamentId]);

  const fetchAchievements = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/world-cup/tournaments/${tournamentId}/achievements`);
      const data = await response.json();
      setAchievements(data.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  if (achievements.length === 0) {
    return null;
  }

  // Separate featured achievement
  const featured = achievements.find(a => a.is_featured);
  const otherAchievements = achievements.filter(a => !a.is_featured);

  return (
    <div className="space-y-6">
      {/* Featured Moment */}
      {featured && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3">

            <span className="text-sm font-semibold uppercase tracking-wide">Iconic Moment</span>
          </div>
          <h3 className="text-2xl font-bold mb-3">{featured.title}</h3>
          <p className="text-white/90 leading-relaxed">{featured.description}</p>
          {featured.players && featured.players.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {featured.players.map((player, idx) => (
                <span key={idx} className="px-3 py-1 bg-white/20 rounded-full text-sm">
                   {player}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Other Moments */}
      {otherAchievements.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherAchievements.map((achievement, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-3">
                {achievement.achievement_type === 'record_break' && <span className="text-2xl"></span>}
                {achievement.achievement_type === 'comeback' && <span className="text-2xl"></span>}
                {achievement.achievement_type === 'upset' && <span className="text-2xl"></span>}
                {achievement.achievement_type === 'historic_moment' && <span className="text-2xl"></span>}
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {achievement.achievement_type.replace('_', ' ')}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{achievement.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{achievement.description}</p>
              {achievement.players && achievement.players.length > 0 && (
                <div className="mt-3 text-xs text-gray-500">
                  {achievement.players.join(' • ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};