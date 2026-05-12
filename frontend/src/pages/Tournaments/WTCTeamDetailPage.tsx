// frontend/src/pages/Tournaments/WTCTeamDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { worldCupAPI } from '../../services/api/worldCupAPI';

interface Victory {
  id: number;
  year: number;
  captain_name: string;
  player_of_tournament: string;
  venue: string;
  final_match: {
    team1_name: string;
    team2_name: string;
    team1_score: number;
    team1_wickets: number;
    team1_overs: number;
    team2_score: number;
    team2_wickets: number;
    team2_overs: number;
    winner_name: string;
    winner_margin: number;
    margin_type: string;
    venue: string;
  };
  squad: Array<{ name: string; is_captain: boolean; is_wicket_keeper: boolean }>;
}

interface TeamDetail {
  team: { id: number; name: string; country: string; test_championship_wins: number };
  victories: Victory[];
}

export const WTCTeamDetailPage: React.FC = () => {
  const { teamName } = useParams<{ teamName: string }>();
  const [teamDetail, setTeamDetail] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => { fetchTeamDetails(); }, [teamName]);

  const fetchTeamDetails = async () => {
    setLoading(true);
    try {
      const response = await worldCupAPI.getTeamDetails(teamName || '', 'test');
      setTeamDetail(response.data);
      if (response.data.victories.length > 0) setSelectedYear(response.data.victories[0].year);
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  if (loading) return <div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent" /></div>;
  if (!teamDetail) return <div className="text-center py-12"><h2 className="text-lg font-bold mb-2">Team not found</h2><Link to="/wtc" className="text-teal-600 text-sm">← Back to WTC</Link></div>;

  const { team, victories } = teamDetail;
  const selectedVictory = victories.find(v => v.year === selectedYear);
  const winsCount = team.test_championship_wins || victories.length;

  return (
    <div 
      className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white" 
      style={{ backgroundImage: 'none' }}
    >
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link to="/wtc" className="text-white/80 hover:text-white text-xs">← Back to WTC</Link>
          <div className="flex flex-wrap justify-between items-center gap-3 mt-2">
            <div><h1 className="text-2xl font-bold text-white">{team.name}</h1><p className="text-teal-100 text-xs">{winsCount} WTC Titles</p></div>
            <div className="flex gap-2">{victories.map(v => (<button key={v.year} onClick={() => setSelectedYear(v.year)} className={`px-3 py-1 rounded-md text-sm font-semibold ${selectedYear === v.year ? 'bg-yellow-500 text-white' : 'bg-white/20 text-white'}`}> {v.year}</button>))}</div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4">
        {selectedVictory && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-white dark:bg-gray-800 rounded p-3 text-center"><div className="text-xs text-gray-500">Year</div><div className="text-xl font-bold text-teal-600">{selectedVictory.year}</div></div>
              <div className="bg-white dark:bg-gray-800 rounded p-3 text-center"><div className="text-xs text-gray-500">Captain</div><div className="font-bold text-sm">{selectedVictory.captain_name}</div></div>
              <div className="bg-white dark:bg-gray-800 rounded p-3 text-center"><div className="text-xs text-gray-500">Player of Tournament</div><div className="font-bold text-sm">{selectedVictory.player_of_tournament}</div></div>
              <div className="bg-white dark:bg-gray-800 rounded p-3 text-center"><div className="text-xs text-gray-500">Venue</div><div className="font-bold text-sm">{selectedVictory.venue?.split(',')[0]}</div></div>
            </div>
            {selectedVictory.final_match && (<div className="bg-white dark:bg-gray-800 rounded p-4"><h3 className="font-semibold text-sm mb-2">Final Match</h3><div className="space-y-2"><div className="flex justify-between"><span>{selectedVictory.final_match.team1_name}</span><span>{selectedVictory.final_match.team1_score}/{selectedVictory.final_match.team1_wickets}</span></div><div className="flex justify-between"><span>{selectedVictory.final_match.team2_name}</span><span>{selectedVictory.final_match.team2_score}/{selectedVictory.final_match.team2_wickets}</span></div><div className="text-center pt-2"><span className="text-teal-600 text-sm font-semibold">{selectedVictory.final_match.winner_name} won by {selectedVictory.final_match.winner_margin} {selectedVictory.final_match.margin_type}</span></div></div></div>)}
            <div className="bg-white dark:bg-gray-800 rounded p-3"><h3 className="font-semibold text-xs mb-2"> Winning Squad ({selectedVictory.squad?.length || 0})</h3><div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">{selectedVictory.squad?.map((p, i) => (<div key={i} className="text-[10px] p-1">{p.is_captain && '(c) '}{p.is_wicket_keeper && '† '}{p.name}</div>))}</div></div>
          </div>
        )}
      </div>
    </div>
  );
};