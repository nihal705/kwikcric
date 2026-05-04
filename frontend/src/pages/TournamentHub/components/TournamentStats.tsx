// frontend/src/pages/TournamentHub/components/TournamentStats.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface BaseStats {
  totalEditions: number;
  mostWins: string;
}

interface OdiT20CtStats extends BaseStats {
  mostRuns: string;
  mostWickets: string;
  highestScore: string;
  bestBowling: string;
}

interface WtcStats extends BaseStats {
  mostPoints: string;
  mostFinals: string;
  highestScore: string;
  bestBowling: string;
}

type TournamentStatsData = OdiT20CtStats | WtcStats;

const tournamentStatsData: Record<string, TournamentStatsData> = {
  odi: {
    totalEditions: 13,
    mostWins: "Australia (6)",
    mostRuns: "Sachin Tendulkar",
    mostWickets: "Glenn McGrath",
    highestScore: "417/6 (India vs Sri Lanka, 2014)",
    bestBowling: "7/15 (Glenn McGrath, 2003)",
  },
  t20: {
    totalEditions: 10,
    mostWins: "India (3), West Indies (2), England (2)",
    mostRuns: "Virat Kohli",
    mostWickets: "Shakib Al Hasan",
    highestScore: "260/6 (Sri Lanka vs Kenya, 2007)",
    bestBowling: "6/8 (Ajantha Mendis, 2012)",
  },
  ct: {
    totalEditions: 9,
    mostWins: "India (3), Australia (2)",
    mostRuns: "Chris Gayle",
    mostWickets: "Kyle Mills",
    highestScore: "352/5 (Australia vs Pakistan, 2009)",
    bestBowling: "6/14 (Mitchell McClenaghan, 2013)",
  },
  wtc: {
    totalEditions: 3,
    mostWins: "New Zealand, Australia, South Africa (1 each)",
    mostPoints: "South Africa (2023-25)",
    mostFinals: "India (2 finals)",
    highestScore: "N/A",
    bestBowling: "N/A",
  },
};

interface TournamentStatsProps {
  tournamentType: 'odi' | 't20' | 'ct' | 'wtc';
}

function isWtcStats(stats: TournamentStatsData): stats is WtcStats {
  return 'mostPoints' in stats;
}

export const TournamentStats: React.FC<TournamentStatsProps> = ({ tournamentType }) => {
  const stats = tournamentStatsData[tournamentType];
  const displayName = {
    odi: 'ODI World Cup',
    t20: 'T20 World Cup',
    ct: 'Champions Trophy',
    wtc: 'World Test Championship',
  }[tournamentType];

  if (!stats) return null;

  const isWTC = isWtcStats(stats);
  const titleDisplayName = displayName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg p-4 text-white mt-4"
    >
      <h3 className="text-sm font-bold text-center mb-3">📊 {titleDisplayName} Statistics</h3>
      
      {!isWTC ? (
        // For ODI, T20, CT - Show runs, wickets, highest score, best bowling
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-center">
          <div>
            <div className="text-xl font-bold">{stats.totalEditions}</div>
            <div className="text-[10px] opacity-80">Editions</div>
          </div>
          <div>
            <div className="text-sm font-bold whitespace-normal break-words">{(stats as OdiT20CtStats).mostWins}</div>
            <div className="text-[10px] opacity-80">Most Titles</div>
          </div>
          <div>
            <div className="text-sm font-bold whitespace-normal break-words">{(stats as OdiT20CtStats).mostRuns}</div>
            <div className="text-[10px] opacity-80">Most Runs</div>
          </div>
          <div>
            <div className="text-sm font-bold whitespace-normal break-words">{(stats as OdiT20CtStats).mostWickets}</div>
            <div className="text-[10px] opacity-80">Most Wickets</div>
          </div>
          <div>
            <div className="text-xs font-bold whitespace-normal break-words">{(stats as OdiT20CtStats).highestScore}</div>
            <div className="text-[10px] opacity-80">Highest Score</div>
          </div>
        </div>
      ) : (
        // For WTC - Show different stats (points, finals)
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div>
            <div className="text-xl font-bold">{stats.totalEditions}</div>
            <div className="text-[10px] opacity-80">Editions</div>
          </div>
          <div>
            <div className="text-sm font-bold whitespace-normal break-words">{stats.mostWins}</div>
            <div className="text-[10px] opacity-80">Most Titles</div>
          </div>
          <div>
            <div className="text-sm font-bold whitespace-normal break-words">{stats.mostPoints}</div>
            <div className="text-[10px] opacity-80">Most Points</div>
          </div>
          <div>
            <div className="text-sm font-bold whitespace-normal break-words">{stats.mostFinals}</div>
            <div className="text-[10px] opacity-80">Most Finals</div>
          </div>
        </div>
      )}
      
      {/* Best Bowling - Only show for non-WTC */}
      {!isWTC && (stats as OdiT20CtStats).bestBowling && (
        <div className="mt-3 pt-2 border-t border-white/20 text-center">
          <span className="text-[10px] opacity-80">Best Bowling: </span>
          <span className="text-xs font-semibold">{(stats as OdiT20CtStats).bestBowling}</span>
        </div>
      )}
    </motion.div>
  );
};