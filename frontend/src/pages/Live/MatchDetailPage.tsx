import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

interface MatchDetail {
  id: string;
  team1: string;
  team2: string;
  score: string;
  overs: string;
  status: string;
  venue: string;
  date: string;
}

export const MatchDetailPage: React.FC = () => {
  const { matchId } = useParams();
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchDetail = async () => {
      try {
        const response = await axios.get(`/api/tournaments/match/${matchId}`);
        setMatch(response.data.data);
      } catch (error) {
        console.error('Failed to fetch match details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatchDetail();
  }, [matchId]);

  if (loading) {
    return <div className="text-center py-10">Loading match details...</div>;
  }

  if (!match) {
    return <div className="text-center py-10">Match not found</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Match Details</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <div className="flex justify-between items-center py-6">
          <div className="text-center flex-1">
            <div className="text-2xl font-bold">{match.team1}</div>
          </div>
          <div className="text-3xl font-bold text-gray-400">VS</div>
          <div className="text-center flex-1">
            <div className="text-2xl font-bold">{match.team2}</div>
          </div>
        </div>
        {match.score && (
          <div className="text-center mt-4">
            <div className="text-3xl font-bold text-green-600">{match.score}</div>
            <div className="text-gray-500">Overs: {match.overs}</div>
          </div>
        )}
        <div className="mt-6 pt-4 border-t text-center text-gray-500">
          <p>Venue: {match.venue}</p>
          <p>Date: {new Date(match.date).toLocaleDateString()}</p>
          <p className="mt-2 text-red-500 font-semibold">Status: {match.status}</p>
        </div>
      </div>
    </div>
  );
};