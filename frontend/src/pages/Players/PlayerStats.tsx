import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface PlayerStatsProps {
  stats: Array<{
    format: string;
    matches: number;
    runs: number;
    wickets: number;
    hundreds: number;
    fifties: number;
    batting_average: number | null;
    bowling_average: number | null;
    strike_rate: number | null;
    economy_rate: number | null;
  }>;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ stats }) => {
  const [view, setView] = useState<'batting' | 'bowling'>('batting');

  const battingData = stats.map(s => ({
    format: s.format,
    runs: s.runs,
    average: s.batting_average || 0,
    strikeRate: s.strike_rate || 0,
    hundreds: s.hundreds,
    fifties: s.fifties,
  }));

  const bowlingData = stats.map(s => ({
    format: s.format,
    wickets: s.wickets,
    average: s.bowling_average || 0,
    economy: s.economy_rate || 0,
  }));

  const radarData = stats.map(s => ({
    subject: s.format,
    batting: Math.min(100, (s.batting_average || 0) / 0.6),
    bowling: Math.min(100, 100 - ((s.bowling_average || 30) - 20)),
  }));

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 w-fit">
        <button
          onClick={() => setView('batting')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'batting'
              ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          Batting Stats
        </button>
        <button
          onClick={() => setView('bowling')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            view === 'bowling'
              ? 'bg-white dark:bg-gray-800 text-green-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          Bowling Stats
        </button>
      </div>

      {/* Batting Stats */}
      {view === 'batting' && (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={battingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="format" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="runs" fill="#4caf50" name="Runs" />
                <Bar yAxisId="right" dataKey="average" fill="#ff9800" name="Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2">Format</th>
                  <th className="text-right py-2">Matches</th>
                  <th className="text-right py-2">Runs</th>
                  <th className="text-right py-2">Avg</th>
                  <th className="text-right py-2">SR</th>
                  <th className="text-right py-2">100s</th>
                  <th className="text-right py-2">50s</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.format} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 font-medium">{stat.format}</td>
                    <td className="text-right">{stat.matches}</td>
                    <td className="text-right">{stat.runs.toLocaleString()}</td>
                    <td className="text-right">{stat.batting_average?.toFixed(2) || '—'}</td>
                    <td className="text-right">{stat.strike_rate?.toFixed(2) || '—'}</td>
                    <td className="text-right">{stat.hundreds}</td>
                    <td className="text-right">{stat.fifties}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Bowling Stats */}
      {view === 'bowling' && (
        <>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bowlingData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="format" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="wickets" fill="#f44336" name="Wickets" />
                <Bar yAxisId="right" dataKey="average" fill="#9c27b0" name="Average" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2">Format</th>
                  <th className="text-right py-2">Matches</th>
                  <th className="text-right py-2">Wickets</th>
                  <th className="text-right py-2">Avg</th>
                  <th className="text-right py-2">Econ</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((stat) => (
                  <tr key={stat.format} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2 font-medium">{stat.format}</td>
                    <td className="text-right">{stat.matches}</td>
                    <td className="text-right">{stat.wickets}</td>
                    <td className="text-right">{stat.bowling_average?.toFixed(2) || '—'}</td>
                    <td className="text-right">{stat.economy_rate?.toFixed(2) || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Radar Chart for Comparison */}
      <div className="h-80 mt-6">
        <h3 className="text-lg font-semibold mb-4">Format Comparison</h3>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            <Radar name="Batting Rating" dataKey="batting" stroke="#4caf50" fill="#4caf50" fillOpacity={0.3} />
            <Radar name="Bowling Rating" dataKey="bowling" stroke="#f44336" fill="#f44336" fillOpacity={0.3} />
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};