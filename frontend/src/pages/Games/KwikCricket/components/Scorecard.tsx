// frontend/src/pages/Games/KwikCricket/components/Scorecard.tsx
import React from 'react';

interface BattingStats {
    name: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    dismissal: string;
    strikeRate: number;
}

interface BowlingStats {
    name: string;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
}

interface ScorecardProps {
    teamName: string;
    battingStats: BattingStats[];
    bowlingStats: BowlingStats[];
    total: number;
    wickets: number;
    overs: number;
    extras?: number;
}

// Format overs from balls (e.g., 9 balls → "1.3")
const formatOversFromBalls = (balls: number): string => {
    const overs = Math.floor(balls / 6);
    const remainingBalls = balls % 6;
    return `${overs}.${remainingBalls}`;
};

// Format overs for bowler (e.g., 1.166666 → 1.1)
const formatBowlerOvers = (oversDecimal: number): string => {
    const oversInt = Math.floor(oversDecimal);
    const balls = Math.round((oversDecimal - oversInt) * 6);
    return `${oversInt}.${balls}`;
};

export const Scorecard: React.FC<ScorecardProps> = ({ 
    teamName, 
    battingStats, 
    bowlingStats, 
    total, 
    wickets, 
    overs,
    extras = 0 
}) => {
    // Filter batsmen who have actually batted
    const battedBatsmen = battingStats.filter(b => b.runs > 0 || b.balls > 0 || b.dismissal !== 'not out');
    const yetToBatCount = battingStats.length - battedBatsmen.length;
    
    // Filter bowlers who actually bowled (overs > 0)
    const activeBowlers = bowlingStats.filter(b => b.overs > 0);

    // Convert overs decimal to actual balls bowled for display
    const totalBallsBowled = Math.round(overs * 6);
    const totalOversFormatted = formatOversFromBalls(totalBallsBowled);

    return (
        <div className="w-full">
            {/* Innings Header */}
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-t-lg border border-gray-200 dark:border-gray-700">
                <div className="font-semibold text-sm text-gray-800 dark:text-white">{teamName} Innings</div>
                <div className="text-xs text-gray-500">{total}/{wickets} ({totalOversFormatted} overs)</div>
            </div>

            {/* Batting Section */}
            <div className="border-x border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table className="w-full text-xs">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-3 py-2 text-left">Batsman</th>
                            <th className="px-3 py-2 text-center w-12">R</th>
                            <th className="px-3 py-2 text-center w-12">B</th>
                            <th className="px-3 py-2 text-center w-10">4s</th>
                            <th className="px-3 py-2 text-center w-10">6s</th>
                            <th className="px-3 py-2 text-center w-16">SR</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {battedBatsmen.map((batsman, idx) => (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                <td className="px-3 py-2">
                                    <span className="font-medium text-gray-800 dark:text-white">{batsman.name}</span>
                                    <div className="text-[9px] text-gray-400">{batsman.dismissal}</div>
                                </td>
                                <td className="px-3 py-2 text-center font-semibold text-gray-900 dark:text-white">{batsman.runs}</td>
                                <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">{batsman.balls}</td>
                                <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">{batsman.fours}</td>
                                <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">{batsman.sixes}</td>
                                <td className="px-3 py-2 text-center text-gray-600 dark:text-gray-400">{batsman.strikeRate}</td>
                            </tr>
                        ))}
                        {yetToBatCount > 0 && (
                            <tr className="bg-gray-50 dark:bg-gray-700/30">
                                <td colSpan={6} className="px-3 py-2 text-xs text-gray-500 italic">
                                    {yetToBatCount} player(s) yet to bat
                                </td>
                            </tr>
                        )}
                        {extras > 0 && (
                            <tr className="bg-gray-50 dark:bg-gray-700/30">
                                <td className="px-3 py-2 font-medium">Extras</td>
                                <td className="px-3 py-2 text-center font-semibold">{extras}</td>
                                <td colSpan={4} className="px-3 py-2 text-xs text-gray-500">(b, lb, w, nb)</td>
                            </tr>
                        )}
                        <tr className="bg-gray-100 dark:bg-gray-700 font-semibold">
                            <td className="px-3 py-2">Total</td>
                            <td className="px-3 py-2 text-center">{total}</td>
                            <td colSpan={4} className="px-3 py-2 text-xs text-gray-500">({wickets} wkts, {totalOversFormatted} overs)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Bowling Section */}
            {activeBowlers.length > 0 && (
                <>
                    <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 border-x border-gray-200 dark:border-gray-700">
                        <div className="font-semibold text-sm text-gray-800 dark:text-white">Bowling</div>
                    </div>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-b-lg overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-3 py-2 text-left">Bowler</th>
                                    <th className="px-3 py-2 text-center w-12">O</th>
                                    <th className="px-3 py-2 text-center w-12">M</th>
                                    <th className="px-3 py-2 text-center w-12">R</th>
                                    <th className="px-3 py-2 text-center w-12">W</th>
                                    <th className="px-3 py-2 text-center w-16">Econ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {activeBowlers.map((bowler, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                        <td className="px-3 py-2 font-medium text-gray-800 dark:text-white">{bowler.name}</td>
                                        <td className="px-3 py-2 text-center">{formatBowlerOvers(bowler.overs)}</td>
                                        <td className="px-3 py-2 text-center">{bowler.maidens}</td>
                                        <td className="px-3 py-2 text-center">{bowler.runs}</td>
                                        <td className="px-3 py-2 text-center font-semibold text-green-600 dark:text-green-400">{bowler.wickets}</td>
                                        <td className="px-3 py-2 text-center">{bowler.economy.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};