import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LiveMatch {
  id: number;
  team1: string;
  team2: string;
  score: string;
  status: string;
}

export const LiveMatchesPage: React.FC = () => {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiveMatches = async () => {
      try {
        const response = await axios.get('/api/tournaments/live');
        setMatches(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch live matches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveMatches();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading live matches...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Live Scores</h1>
      {matches.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No live matches at the moment</div>
      ) : (
        <div className="grid gap-4">
          {matches.map((match) => (
            <div key={match.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <div className="font-bold text-lg">{match.team1}</div>
                </div>
                <div className="text-2xl font-bold text-gray-400">VS</div>
                <div className="text-center flex-1">
                  <div className="font-bold text-lg">{match.team2}</div>
                </div>
              </div>
              {match.score && (
                <div className="text-center mt-4 text-green-600 font-semibold">{match.score}</div>
              )}
              <div className="text-center mt-2 text-sm text-red-500 animate-pulse">● LIVE</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};