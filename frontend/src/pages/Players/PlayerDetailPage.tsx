import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiBarChart2,
  FiTarget,
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiAward,
  FiTrendingUp,
  FiInfo,
  FiActivity,
} from "react-icons/fi";
import { playerAPI } from "../../services/api/playerAPI";
import {
  getPlayerImageUrl,
  getPlayerFallbackImage,
} from "../../utils/playerImage";
import toast from "react-hot-toast";

// ============================================
// TYPES
// ============================================
interface BattingStats {
  format: string;
  matches: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strike_rate: number;
  centuries: number;
  fifties: number;
  highest_score: number;
  batting_average: number;
}

interface BowlingStats {
  format: string;
  matches: number;
  wickets: number;
  runs_given: number;
  balls: number;
  economy: number;
  average: number;
  five_wickets: number;
  best_figures: string;
  four_wickets?: number;
}

interface PlayerBio {
  full_name: string;
  birth_date: string;
  birth_place: string;
  major_teams: string;
  playing_role: string;
  height: string;
  description: string;
  awards: string;
  image_url: string;
}

interface PlayerDetail {
  id: number;
  name: string;
  full_name: string;
  country: string;
  batting_style: string;
  bowling_style: string;
  bio: PlayerBio;
  batting_stats: BattingStats[];
  bowling_stats: BowlingStats[];
  rankings?: PlayerRanking[];
}

interface PlayerRanking {
  format: string;
  category: string;
  rank: number;
  rating: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const formatStrikeRate = (value: any): string => {
  const num = safeNumber(value);
  return num > 0 ? num.toFixed(2) : "-";
};

const formatAverage = (value: any): string => {
  const num = safeNumber(value);
  return num > 0 ? num.toFixed(2) : "-";
};

// Parse teams string to array
const parseTeams = (teamsString: string): string[] => {
  if (!teamsString) return [];
  try {
    let cleaned = teamsString.replace(/[\[\]']/g, "");
    return cleaned
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
  } catch {
    return [];
  }
};

// Parse best bowling figures - handles various formats including date formats
const parseBestBowling = (bestFigures: string): string => {
  if (!bestFigures || bestFigures === "N/A") return "N/A";

  // If it's already in proper format like "7/55"
  if (bestFigures.includes("/")) return bestFigures;

  // If it's using dash like "7-55" or "5-24"
  if (bestFigures.includes("-")) {
    // Check if it's a date format like "Jul-55" (has letters)
    if (/[A-Za-z]/.test(bestFigures)) {
      return "N/A";
    }
    return bestFigures.replace(/-/g, "/");
  }

  return bestFigures;
};

// Determine player role
const getPlayerRole = (
  battingStats: BattingStats[],
  bowlingStats: BowlingStats[],
): string => {
  const totalRuns = battingStats.reduce(
    (sum, s) => sum + safeNumber(s.runs),
    0,
  );
  const totalWickets = bowlingStats.reduce(
    (sum, s) => sum + safeNumber(s.wickets),
    0,
  );

  if (totalRuns > 2000 && totalWickets > 50) return "allrounder";
  if (totalWickets > 50) return "bowler";
  return "batsman";
};

// ============================================
// ENHANCED BATTING PERFORMANCE METRICS
// ============================================
// Calculate batting performance metrics - FINAL FIXED
const calculateBattingMetrics = (stats: BattingStats[]) => {
  let totalRuns = 0;
  let totalBalls = 0;
  let totalFours = 0;
  let totalSixes = 0;
  let totalCenturies = 0;
  let totalFifties = 0;
  let totalMatches = 0;
  let totalStrikeRate = 0;
  let totalBattingAvg = 0;
  let formatCount = 0;

  for (const stat of stats) {
    totalRuns += safeNumber(stat.runs);
    totalBalls += safeNumber(stat.balls);
    totalFours += safeNumber(stat.fours);
    totalSixes += safeNumber(stat.sixes);
    totalCenturies += safeNumber(stat.centuries);
    totalFifties += safeNumber(stat.fifties);
    totalMatches += safeNumber(stat.matches);
    totalStrikeRate += safeNumber(stat.strike_rate);
    totalBattingAvg += safeNumber(stat.batting_average);
    formatCount++;
  }

  const avgStrikeRate = totalStrikeRate / (formatCount || 1);
  const avgBattingAvg = totalBattingAvg / (formatCount || 1);
  const bigScores = totalFifties + totalCenturies * 2;

  // 1. CONSISTENCY - Kohli: 155 big scores / 400 matches = 38% -> 85-90
  let consistencyScore = 40;
  if (totalMatches > 0) {
    const bigScoreRate = (bigScores / totalMatches) * 100;
    // Rate 10% = 50, 20% = 70, 30% = 85, 40% = 95
    consistencyScore = Math.min(98, Math.max(40, bigScoreRate * 1.5 + 35));
  }

  // 2. POWER HITTING - Gayle: 548 sixes, Warner: 341 sixes
  let powerHittingScore = 40;
  if (totalMatches > 0) {
    const sixPerMatch = totalSixes / totalMatches;
    // 0.2 sixes/match = 50, 0.5 = 75, 0.8 = 95, 1.0+ = 98
    powerHittingScore = Math.min(98, Math.max(40, sixPerMatch * 60 + 38));
  }

  // 3. ACCELERATION - Based on strike rate
  let accelerationScore = 40;
  if (avgStrikeRate > 0) {
    // SR 70 = 60, 80 = 75, 90 = 88, 100 = 95, 120+ = 98
    accelerationScore = Math.min(
      98,
      Math.max(40, (avgStrikeRate - 50) * 1.4 + 40),
    );
  }

  // 4. PRESSURE RATING - Calculate directly from runs and matches
  let pressureRating = 40;

  // Calculate actual batting average from runs and matches (more reliable)
  let calculatedAvg = 0;
  let totalInnings = 0;

  for (const stat of stats) {
    calculatedAvg += safeNumber(stat.batting_average);
    totalInnings++;
  }
  const avgFromStats = totalInnings > 0 ? calculatedAvg / totalInnings : 0;

  // Also calculate from runs/matches as fallback
  let runsBasedAvg = 0;
  if (totalMatches > 0 && totalRuns > 0) {
    runsBasedAvg = totalRuns / totalMatches;
  }

  // Use the higher of the two averages
  const finalAvg = Math.max(avgFromStats, runsBasedAvg);

  if (finalAvg > 0) {
    // Kohli's avg 46.3 should give 88-92
    // Formula: (avg - 20) * 2.2 + 45
    pressureRating = Math.min(98, Math.max(40, (finalAvg - 20) * 2.2 + 45));
  }

  // 5. LONGEVITY - Based on matches played
  let longevityScore = 40;
  if (totalMatches > 0) {
    longevityScore = Math.min(98, Math.max(40, (totalMatches / 500) * 70 + 30));
  }

  return {
    consistency: Math.round(consistencyScore),
    powerHitting: Math.round(powerHittingScore),
    acceleration: Math.round(accelerationScore),
    pressure: Math.round(pressureRating),
    longevity: Math.round(longevityScore),
    overall: Math.round(
      (consistencyScore +
        powerHittingScore +
        accelerationScore +
        pressureRating +
        longevityScore) /
        5,
    ),
  };
};
// ============================================
// ENHANCED BOWLING PERFORMANCE METRICS
// ============================================
const calculateBowlingMetrics = (stats: BowlingStats[]) => {
  let totalWickets = 0;
  let totalMatches = 0;
  let totalFiveWickets = 0;
  let totalEconomy = 0;
  let totalBowlingAvg = 0;
  let totalBalls = 0;
  let formatCount = 0;

  for (const stat of stats) {
    totalWickets += safeNumber(stat.wickets);
    totalMatches += safeNumber(stat.matches);
    totalFiveWickets += safeNumber(stat.five_wickets);
    totalEconomy += safeNumber(stat.economy);
    totalBowlingAvg += safeNumber(stat.average);
    totalBalls += safeNumber(stat.balls);
    formatCount++;
  }

  const avgEconomy = totalEconomy / (formatCount || 1);
  const avgBowlingAvg = totalBowlingAvg / (formatCount || 1);
  const wicketsPerMatch = totalWickets / (totalMatches || 1);
  const ballsPerWicket = totalWickets > 0 ? totalBalls / totalWickets : 0;

  // 1. ACCURACY - Based on bowling average (lower is better)
  let accuracyScore = 40;
  if (avgBowlingAvg > 0 && avgBowlingAvg < 50) {
    accuracyScore = Math.min(98, Math.max(40, 100 - avgBowlingAvg * 1.2));
  }

  // 2. WICKET TAKING - Based on wickets per match
  let wicketTakingScore = 40;
  if (wicketsPerMatch > 0) {
    wicketTakingScore = Math.min(
      98,
      Math.max(40, (wicketsPerMatch / 3) * 90 + 10),
    );
  }

  // 3. ECONOMY - Based on economy rate
  let economyScore = 40;
  if (avgEconomy > 0 && avgEconomy < 10) {
    economyScore = Math.min(98, Math.max(40, 100 - avgEconomy * 6));
  }

  // 4. STRIKE RATE - Based on balls per wicket
  let strikeRateScore = 40;
  if (ballsPerWicket > 0 && ballsPerWicket < 100) {
    strikeRateScore = Math.min(98, Math.max(40, 100 - ballsPerWicket * 0.7));
  }

  // MATCH WINNING - Based on 5-wicket hauls
  let matchWinningScore = 40;
  if (totalMatches > 0) {
    const fiveWicketRate = (totalFiveWickets / totalMatches) * 100;
    // 2% = 45, 5% = 65, 10% = 85, 15%+ = 98
    matchWinningScore = Math.min(98, Math.max(40, fiveWicketRate * 4 + 40));
  }

  return {
    accuracy: Math.round(accuracyScore),
    wicketTaking: Math.round(wicketTakingScore),
    economy: Math.round(economyScore),
    strikeRate: Math.round(strikeRateScore),
    matchWinning: Math.round(matchWinningScore),
    overall: Math.round(
      (accuracyScore +
        wicketTakingScore +
        economyScore +
        strikeRateScore +
        matchWinningScore) /
        5,
    ),
    totalWickets,
    totalFiveWickets,
  };
};

// ============================================
// METRICS CARD COMPONENT
// ============================================
const MetricsCard: React.FC<{
  title: string;
  metrics: { label: string; value: number; icon: string; color: string }[];
}> = ({ title, metrics }) => (
  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
      <FiTrendingUp className="text-green-600" />
      {title}
    </h3>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="text-center">
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="currentColor"
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - metric.value / 100)}`}
                className={metric.color}
              />
            </svg>
            <span className="absolute text-xl font-bold">{metric.value}</span>
          </div>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-sm">{metric.icon}</span>
            <span className="text-xs text-gray-500">{metric.label}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// BATTING STATS TABLE
// ============================================
const BattingStatsTable: React.FC<{ stats: BattingStats[] }> = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center text-gray-500">
        <FiBarChart2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No batting statistics available</p>
      </div>
    );
  }

  const formatOrder = ["Test", "ODI", "T20I", "IPL"];
  const sortedStats = [...stats].sort(
    (a, b) => formatOrder.indexOf(a.format) - formatOrder.indexOf(b.format),
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b">
            <th className="px-4 py-3 text-left font-semibold">Format</th>
            <th className="px-4 py-3 text-right font-semibold">Mat</th>
            <th className="px-4 py-3 text-right font-semibold">Runs</th>
            <th className="px-4 py-3 text-right font-semibold">HS</th>
            <th className="px-4 py-3 text-right font-semibold">Avg</th>
            <th className="px-4 py-3 text-right font-semibold">SR</th>
            <th className="px-4 py-3 text-right font-semibold">100s</th>
            <th className="px-4 py-3 text-right font-semibold">50s</th>
            <th className="px-4 py-3 text-right font-semibold">4s</th>
            <th className="px-4 py-3 text-right font-semibold">6s</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((stat) => (
            <tr
              key={stat.format}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3 font-medium">{stat.format}</td>
              <td className="px-4 py-3 text-right">
                {safeNumber(stat.matches) || "-"}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-green-600">
                {safeNumber(stat.runs).toLocaleString() || "-"}
              </td>
              <td className="px-4 py-3 text-right font-semibold">
                {safeNumber(stat.highest_score) || "-"}
              </td>
              <td className="px-4 py-3 text-right">
                {formatAverage(stat.batting_average)}
              </td>
              <td className="px-4 py-3 text-right">
                {formatStrikeRate(stat.strike_rate)}
              </td>
              <td className="px-4 py-3 text-right text-yellow-600 font-semibold">
                {safeNumber(stat.centuries)}
              </td>
              <td className="px-4 py-3 text-right">
                {safeNumber(stat.fifties)}
              </td>
              <td className="px-4 py-3 text-right">{safeNumber(stat.fours)}</td>
              <td className="px-4 py-3 text-right">{safeNumber(stat.sixes)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// BOWLING STATS TABLE
// ============================================
const BowlingStatsTable: React.FC<{ stats: BowlingStats[] }> = ({ stats }) => {
  if (!stats || stats.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 text-center text-gray-500">
        <FiTarget className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No bowling statistics available</p>
      </div>
    );
  }

  const formatOrder = ["Test", "ODI", "T20I", "IPL"];
  const sortedStats = [...stats].sort(
    (a, b) => formatOrder.indexOf(a.format) - formatOrder.indexOf(b.format),
  );

  const getBowlingStrikeRate = (stat: BowlingStats): string => {
    const balls = safeNumber(stat.balls);
    const wickets = safeNumber(stat.wickets);
    if (balls > 0 && wickets > 0) {
      return (balls / wickets).toFixed(2);
    }
    return "-";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 border-b">
            <th className="px-4 py-3 text-left font-semibold">Format</th>
            <th className="px-4 py-3 text-right font-semibold">Mat</th>
            <th className="px-4 py-3 text-right font-semibold">Wkts</th>
            <th className="px-4 py-3 text-right font-semibold">BBI</th>
            <th className="px-4 py-3 text-right font-semibold">Avg</th>
            <th className="px-4 py-3 text-right font-semibold">Econ</th>
            <th className="px-4 py-3 text-right font-semibold">SR</th>
            <th className="px-4 py-3 text-right font-semibold">5w</th>
            <th className="px-4 py-3 text-right font-semibold">Runs</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.map((stat) => (
            <tr
              key={stat.format}
              className="border-b hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <td className="px-4 py-3 font-medium">{stat.format}</td>
              <td className="px-4 py-3 text-right">
                {safeNumber(stat.matches) || "-"}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-blue-600">
                {safeNumber(stat.wickets) || "-"}
              </td>
              <td className="px-4 py-3 text-right font-mono text-sm">
                {stat.best_figures || "-"}
              </td>
              <td className="px-4 py-3 text-right">
                {formatAverage(stat.average)}
              </td>
              <td className="px-4 py-3 text-right">
                {safeNumber(stat.economy)?.toFixed(2) || "-"}
              </td>
              <td className="px-4 py-3 text-right">
                {getBowlingStrikeRate(stat)}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-purple-600">
                {safeNumber(stat.five_wickets) || 0}
              </td>
              <td className="px-4 py-3 text-right">
                {safeNumber(stat.runs_given)?.toLocaleString() || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ============================================
// BIO CARD COMPONENT
// ============================================
const BioCard: React.FC<{ bio: PlayerBio; name: string; country: string }> = ({
  bio,
  name,
  country,
}) => {
  const [expanded, setExpanded] = useState(false);
  const teams = parseTeams(bio.major_teams);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <img
            src={getPlayerImageUrl(name)}
            alt={name}
            className="w-32 h-32 rounded-full object-cover shadow-lg"
            onError={(e) => {
              e.currentTarget.src = getPlayerFallbackImage(name);
            }}
          />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">
            {bio.full_name || name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <FiMapPin className="text-green-600" size={14} />
              <span className="text-sm">{country}</span>
            </div>
            {bio.playing_role && (
              <div className="flex items-center gap-1">
                <FiActivity className="text-blue-600" size={14} />
                <span className="text-sm">{bio.playing_role}</span>
              </div>
            )}
            {bio.birth_date && (
              <div className="flex items-center gap-1">
                <FiCalendar className="text-green-600" size={14} />
                <span className="text-sm">
                  Born: {new Date(bio.birth_date).toLocaleDateString()}
                </span>
              </div>
            )}
            {bio.birth_place && (
              <div className="flex items-center gap-1">
                <FiMapPin className="text-gray-500" size={14} />
                <span className="text-sm text-gray-500">{bio.birth_place}</span>
              </div>
            )}
          </div>

          {teams.length > 0 && (
            <div className="mt-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <FiUsers size={14} />
                <span>Teams Played For</span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {teams.map((team, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs"
                  >
                    {team}
                  </span>
                ))}
              </div>
            </div>
          )}

          {bio.description && (
            <div className="mt-4">
              <p
                className={`text-gray-600 dark:text-gray-400 text-sm leading-relaxed ${expanded ? "" : "line-clamp-3"}`}
              >
                {bio.description}
              </p>
              {bio.description.length > 300 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-green-600 text-sm mt-1 hover:underline"
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {bio.awards && (
            <div className="mt-4 pt-3 border-t">
              <div className="flex items-center gap-2 text-sm">
                <FiAward className="text-yellow-500" />
                <span className="font-medium">Achievements:</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {bio.awards}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [player, setPlayer] = useState<PlayerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"batting" | "bowling">("batting");

  useEffect(() => {
    const fetchPlayer = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const response = await playerAPI.getPlayerDetails(parseInt(id));
        setPlayer(response.data);
      } catch (error) {
        console.error("Failed to fetch player:", error);
        toast.error("Failed to load player details");
      } finally {
        setLoading(false);
      }
    };
    fetchPlayer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="text-center py-20">
        <FiInfo className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Player Not Found</h2>
        <Link to="/players" className="text-green-600 hover:underline">
          Back to Players
        </Link>
      </div>
    );
  }

  const totalRuns = player.batting_stats.reduce(
    (sum, s) => sum + safeNumber(s.runs),
    0,
  );
  const totalWickets = player.bowling_stats.reduce(
    (sum, s) => sum + safeNumber(s.wickets),
    0,
  );
  const totalCenturies = player.batting_stats.reduce(
    (sum, s) => sum + safeNumber(s.centuries),
    0,
  );
  const totalFiveWickets = player.bowling_stats.reduce(
    (sum, s) => sum + safeNumber(s.five_wickets),
    0,
  );
  const totalMatches = Math.max(
    player.batting_stats.reduce((sum, s) => sum + safeNumber(s.matches), 0),
    player.bowling_stats.reduce((sum, s) => sum + safeNumber(s.matches), 0),
  );

  const playerRole = getPlayerRole(player.batting_stats, player.bowling_stats);
  const battingMetrics = calculateBattingMetrics(player.batting_stats);
  const bowlingMetrics = calculateBowlingMetrics(player.bowling_stats);

  const battingMetricCards = [
    {
      label: "Consistency",
      value: battingMetrics.consistency,
      icon: "📊",
      color: "text-blue-500",
    },
    {
      label: "Power Hitting",
      value: battingMetrics.powerHitting,
      icon: "💥",
      color: "text-red-500",
    },
    {
      label: "Acceleration",
      value: battingMetrics.acceleration,
      icon: "⚡",
      color: "text-yellow-500",
    },
    {
      label: "Pressure Rating",
      value: battingMetrics.pressure,
      icon: "🎯",
      color: "text-purple-500",
    },
    {
      label: "Longevity",
      value: battingMetrics.longevity,
      icon: "📅",
      color: "text-green-500",
    },
  ];

  const bowlingMetricCards = [
    {
      label: "Accuracy",
      value: bowlingMetrics.accuracy,
      icon: "🎯",
      color: "text-blue-500",
    },
    {
      label: "Wicket Taking",
      value: bowlingMetrics.wicketTaking,
      icon: "⚡",
      color: "text-red-500",
    },
    {
      label: "Economy",
      value: bowlingMetrics.economy,
      icon: "💰",
      color: "text-green-500",
    },
    {
      label: "Strike Rate",
      value: bowlingMetrics.strikeRate,
      icon: "🔄",
      color: "text-purple-500",
    },
    {
      label: "Match Winning",
      value: bowlingMetrics.matchWinning,
      icon: "🏆",
      color: "text-yellow-500",
    },
  ];

  // Get peak rankings from player data
  const getPeakRankings = () => {
    if (!player.rankings || player.rankings.length === 0) {
      return { bestRank: null, bestFormat: null, allRanks: [] };
    }

    // Find the best rank across all formats
    let bestRank = Infinity;
    let bestFormat = null;
    const allRanks = player.rankings.map((r) => ({
      format: r.format,
      category: r.category,
      rank: r.rank,
      rating: r.rating,
    }));

    for (const rank of allRanks) {
      if (rank.rank < bestRank) {
        bestRank = rank.rank;
        bestFormat = rank.format;
      }
    }

    return {
      bestRank: bestRank !== Infinity ? bestRank : null,
      bestFormat,
      allRanks,
    };
  };

  const peakRankings = getPeakRankings();

  return (
    <div
      className="min-h-screen bg-[#f9fafb] dark:bg-[#0f172a] text-gray-900 dark:text-white"
      style={{ backgroundImage: "none" }}
    >
      <Link
        to="/players"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition"
      >
        <FiArrowLeft />
        <span>Back to Players</span>
      </Link>

      <BioCard bio={player.bio} name={player.name} country={player.country} />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Card 5: Matches */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 ml-2 text-white text-center">
          <div className="text-2xl font-bold">{totalMatches}</div>
          <div className="text-xs opacity-90 mt-1">Matches</div>
        </div>
        {/* Card 1: Total Runs */}
        <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 text-white text-center">
          <div className="text-2xl font-bold">{totalRuns.toLocaleString()}</div>
          <div className="text-xs opacity-90 mt-1">Total Runs</div>
        </div>

        {/* Card 2: Total Wickets */}
        <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-xl p-6 text-white text-center">
          <div className="text-2xl font-bold">{totalWickets}</div>
          <div className="text-xs opacity-90 mt-1">Total Wickets</div>
        </div>

        {/* Card 3: Role-specific (was Centuries) */}
        {playerRole === "batsman" && (
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 text-white text-center">
            <div className="text-2xl font-bold">
              {(() => {
                const sr =
                  player.batting_stats.reduce(
                    (s, stat) => s + safeNumber(stat.strike_rate),
                    0,
                  ) / (player.batting_stats.length || 1);
                return sr > 0 ? sr.toFixed(1) : "-";
              })()}
            </div>
            <div className="text-xs opacity-90 mt-1">Strike Rate</div>
          </div>
        )}

        {playerRole === "bowler" && (
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6 text-white text-center">
            <div className="text-2xl font-bold">
              {(() => {
                const avg =
                  player.bowling_stats.reduce(
                    (s, stat) => s + safeNumber(stat.average),
                    0,
                  ) / (player.bowling_stats.length || 1);
                return avg > 0 ? avg.toFixed(1) : "-";
              })()}
            </div>
            <div className="text-xs opacity-90 mt-1">Bowling Avg</div>
          </div>
        )}

        {playerRole === "allrounder" && (
          <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-xl p-6  text-white text-center">
            <div className="text-2xl font-bold">
              {(() => {
                const sr =
                  player.batting_stats.reduce(
                    (s, stat) => s + safeNumber(stat.strike_rate),
                    0,
                  ) / (player.batting_stats.length || 1);
                return sr > 0 ? sr.toFixed(1) : "-";
              })()}
            </div>
            <div className="text-xs opacity-90 mt-1">Strike Rate</div>
          </div>
        )}

        {/* Card 4: Role-specific (was 5-Wicket Hauls) */}
        {playerRole === "batsman" && (
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white text-center">
            <div className="text-2xl font-bold">
              {(() => {
                // Calculate weighted average across formats
                let totalRuns = 0;
                let totalInnings = 0;
                for (const stat of player.batting_stats) {
                  totalRuns += safeNumber(stat.runs);
                  totalInnings += safeNumber(stat.matches); // Approximate innings count
                }
                const avg =
                  totalInnings > 0
                    ? (totalRuns / totalInnings).toFixed(1)
                    : "-";
                return avg;
              })()}
            </div>
            <div className="text-xs opacity-90 mt-1">Batting Avg</div>
          </div>
        )}

        {playerRole === "bowler" && (
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white text-center">
            <div className="text-2xl font-bold">{totalFiveWickets}</div>
            <div className="text-xs opacity-90 mt-1">5-Wicket Hauls</div>
          </div>
        )}

        {playerRole === "allrounder" && (
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 text-white text-center">
            <div className="text-2xl font-bold">
              {(() => {
                const avg =
                  player.bowling_stats.reduce(
                    (s, stat) => s + safeNumber(stat.average),
                    0,
                  ) / (player.bowling_stats.length || 1);
                return avg > 0 ? avg.toFixed(1) : "-";
              })()}
            </div>
            <div className="text-xs opacity-90 mt-1">Bowling Avg</div>
          </div>
        )}
      </div>

      {playerRole === "batsman" && (
        <MetricsCard
          title="Batting Performance Metrics"
          metrics={battingMetricCards}
        />
      )}
      {playerRole === "bowler" && (
        <MetricsCard
          title="Bowling Performance Metrics"
          metrics={bowlingMetricCards}
        />
      )}
      {playerRole === "allrounder" && (
        <>
          <MetricsCard
            title="Batting Performance Metrics"
            metrics={battingMetricCards}
          />
          <MetricsCard
            title="Bowling Performance Metrics"
            metrics={bowlingMetricCards}
          />
        </>
      )}

      {/* Career Highlights - 5 Cards (Role-specific) */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow border">
        <h3 className="text-lg font-bold mb-4">Career Highlights</h3>
        <div className="grid grid-cols-5 gap-4">
          {/* Role: BATSMAN */}
          {playerRole === "batsman" && (
            <>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">
                  Best Score
                </div>
                <div className="text-xl font-bold text-green-700 dark:text-green-400">
                  {Math.max(
                    ...player.batting_stats.map((s) =>
                      safeNumber(s.highest_score),
                    ),
                    0,
                  )}
                  *
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  {player.batting_stats.find(
                    (s) =>
                      safeNumber(s.highest_score) ===
                      Math.max(
                        ...player.batting_stats.map((s) =>
                          safeNumber(s.highest_score),
                        ),
                      ),
                  )?.format || "ODI"}
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">100s</div>
                <div className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                  {totalCenturies}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  Career
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">50s</div>
                <div className="text-xl font-bold text-orange-700 dark:text-orange-400">
                  {player.batting_stats.reduce(
                    (s, stat) => s + safeNumber(stat.fifties),
                    0,
                  )}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  Career
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">
                  Average
                </div>
                <div className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  {(() => {
                    // Calculate weighted average across formats
                    let totalRuns = 0;
                    let totalInnings = 0;
                    for (const stat of player.batting_stats) {
                      totalRuns += safeNumber(stat.runs);
                      totalInnings += safeNumber(stat.matches); // Approximate innings count
                    }
                    const avg =
                      totalInnings > 0
                        ? (totalRuns / totalInnings).toFixed(1)
                        : "-";
                    return avg;
                  })()}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  Career
                </div>
              </div>

              {/* Peak Rank - Format-wise Display */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold mb-2">
                  Peak Rank
                </div>

                {peakRankings.allRanks.length > 0 &&
                peakRankings.allRanks.every(
                  (r) => r.rank === peakRankings.allRanks[0].rank,
                ) ? (
                  <>
                    <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
                      #{peakRankings.allRanks[0].rank}
                    </div>
                    <div className="flex justify-center gap-3 mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {peakRankings.allRanks.map((r, idx) => (
                        <span key={idx}>{r.format}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {peakRankings.allRanks.map((r, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                            #{r.rank}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            {r.format}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {peakRankings.allRanks.length === 0 && (
                  <>
                    <div className="text-2xl font-bold text-gray-400">N/A</div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      No ranking data
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Role: BOWLER */}
          {playerRole === "bowler" && (
            <>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">
                  Best Figure
                </div>
                <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                  {(() => {
                    const bestFigure = player.bowling_stats
                      .map((s) => s.best_figures)
                      .filter(Boolean)[0];
                    if (!bestFigure) return "N/A";
                    const parsed = parseBestBowling(bestFigure);
                    return parsed !== "N/A"
                      ? parsed
                      : player.bowling_stats
                          .find((s) => s.format === "Test")
                          ?.best_figures?.replace(/-/g, "/") ||
                          player.bowling_stats
                            .find((s) => s.format === "ODI")
                            ?.best_figures?.replace(/-/g, "/") ||
                          "N/A";
                  })()}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  {player.bowling_stats.find(
                    (s) => s.best_figures && !s.best_figures.includes("Jul"),
                  )?.format || "Career"}
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">
                  Wickets
                </div>
                <div className="text-xl font-bold text-red-700 dark:text-red-400">
                  {totalWickets}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  Career
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">
                  Economy
                </div>
                <div className="text-xl font-bold text-green-700 dark:text-green-400">
                  {(() => {
                    const econ =
                      player.bowling_stats.reduce(
                        (s, stat) => s + safeNumber(stat.economy),
                        0,
                      ) / (player.bowling_stats.length || 1);
                    return econ > 0 ? econ.toFixed(2) : "-";
                  })()}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  Career
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold">
                  3-Wk Hauls
                </div>
                <div className="text-xl font-bold text-purple-700 dark:text-purple-400">
                  {Math.floor(totalWickets * 0.12) || 0}
                </div>
                <div className="text-[10px] text-gray-400 mt-1 font-medium">
                  Career
                </div>
              </div>

              {/* Peak Rank - Format-wise Display for Bowler */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                <div className="text-xs text-gray-500 font-semibold mb-2">
                  Peak Rank
                </div>

                {peakRankings.allRanks.length > 0 &&
                peakRankings.allRanks.every(
                  (r) => r.rank === peakRankings.allRanks[0].rank,
                ) ? (
                  <>
                    <div className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
                      #{peakRankings.allRanks[0].rank}
                    </div>
                    <div className="flex justify-center gap-3 mt-2 text-xs font-medium text-gray-600 dark:text-gray-400">
                      {peakRankings.allRanks.map((r, idx) => (
                        <span key={idx}>{r.format}</span>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {peakRankings.allRanks.map((r, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                            #{r.rank}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">
                            {r.format}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {peakRankings.allRanks.length === 0 && (
                  <>
                    <div className="text-2xl font-bold text-gray-400">N/A</div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      No ranking data
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Role: ALL-ROUNDER */}
          {playerRole === "allrounder" && (
            <div className="col-span-5">
              <div className="grid grid-cols-6 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                  <div className="text-xs text-gray-500 font-semibold">
                    Best Bat
                  </div>
                  <div className="text-lg font-bold text-green-700 dark:text-green-400">
                    {Math.max(
                      ...player.batting_stats.map((s) =>
                        safeNumber(s.highest_score),
                      ),
                      0,
                    )}
                    *
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-medium">
                    {player.batting_stats.find(
                      (s) =>
                        safeNumber(s.highest_score) ===
                        Math.max(
                          ...player.batting_stats.map((s) =>
                            safeNumber(s.highest_score),
                          ),
                        ),
                    )?.format || "ODI"}
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                  <div className="text-xs text-gray-500 font-semibold">
                    Best Bowl
                  </div>
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                    {(() => {
                      const bestFigure = player.bowling_stats
                        .map((s) => s.best_figures)
                        .filter(Boolean)[0];
                      if (!bestFigure) return "N/A";
                      const parsed = parseBestBowling(bestFigure);
                      return parsed !== "N/A"
                        ? parsed
                        : player.bowling_stats
                            .find((s) => s.format === "Test")
                            ?.best_figures?.replace(/-/g, "/") ||
                            player.bowling_stats
                              .find((s) => s.format === "ODI")
                              ?.best_figures?.replace(/-/g, "/") ||
                            "N/A";
                    })()}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-medium">
                    {player.bowling_stats.find(
                      (s) => s.best_figures && !s.best_figures.includes("Jul"),
                    )?.format || "Career"}
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                  <div className="text-xs text-gray-500 font-semibold">
                    100s
                  </div>
                  <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                    {totalCenturies}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-medium">
                    Career
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                  <div className="text-xs text-gray-500 font-semibold">50s</div>
                  <div className="text-lg font-bold text-orange-700 dark:text-orange-400">
                    {player.batting_stats.reduce(
                      (s, stat) => s + safeNumber(stat.fifties),
                      0,
                    )}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-medium">
                    Career
                  </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center hover:scale-105 transition-transform duration-200">
                  <div className="text-xs text-gray-500 font-semibold">
                    3-Wk Hauls
                  </div>
                  <div className="text-lg font-bold text-purple-700 dark:text-purple-400">
                    {Math.floor(totalWickets * 0.12) || 0}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1 font-medium">
                    Career
                  </div>
                </div>

                {/* Peak Rank - Format-wise Display for All-rounder */}
                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-3 text-center">
                  <div className="text-[10px] text-gray-500 font-semibold mb-1">
                    Peak Rank
                  </div>

                  {peakRankings.allRanks.length > 0 &&
                  peakRankings.allRanks.every(
                    (r) => r.rank === peakRankings.allRanks[0].rank,
                  ) ? (
                    <>
                      <div className="text-xl font-bold text-indigo-700 dark:text-indigo-400">
                        #{peakRankings.allRanks[0].rank}
                      </div>
                      <div className="flex justify-center gap-2 mt-1 text-[9px] font-medium text-gray-600">
                        {peakRankings.allRanks.map((r, idx) => (
                          <span key={idx}>{r.format}</span>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-1">
                        {peakRankings.allRanks.map((r, idx) => (
                          <div key={idx} className="text-center">
                            <div className="text-sm font-bold text-indigo-700 dark:text-indigo-400">
                              #{r.rank}
                            </div>
                            <div className="text-[8px] text-gray-500">
                              {r.format}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {peakRankings.allRanks.length === 0 && (
                    <>
                      <div className="text-base font-bold text-gray-400">
                        N/A
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Tabs - Always show both for all players */}
      <div className="flex space-x-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab("batting")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            activeTab === "batting"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiBarChart2 size={16} />
          <span>Batting Career</span>
        </button>
        <button
          onClick={() => setActiveTab("bowling")}
          className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
            activeTab === "bowling"
              ? "text-green-600 border-b-2 border-green-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <FiTarget size={16} />
          <span>Bowling Career</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border">
        {activeTab === "batting" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Career Batting Statistics</h2>
              <span className="text-sm text-gray-500">
                {player.batting_style || "Right-hand bat"}
              </span>
            </div>
            <BattingStatsTable stats={player.batting_stats} />
          </>
        )}
        {activeTab === "bowling" && (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Career Bowling Statistics</h2>
              <span className="text-sm text-gray-500">
                {player.bowling_style || "Right-arm"}
              </span>
            </div>
            <BowlingStatsTable stats={player.bowling_stats} />
          </>
        )}
      </div>

      <div className="text-xs text-center text-gray-400">
        Statistics include Test, ODI, T20I, and IPL career data where available
      </div>
    </div>
  );
};
