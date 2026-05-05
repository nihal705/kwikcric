// frontend/src/pages/Games/KwikCricket/components/MatchSetup.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { teamsData, iplTeamsData } from '../data/teamsData';

interface MatchSetupProps {
    onStart: (settings: any) => void;
    onProceedToSquad?: (userTeam: string, opponentTeam: string) => void;
    hasSquadSelected?: boolean;
    stats: any;
}

export const MatchSetup: React.FC<MatchSetupProps> = ({ 
    onStart, 
    onProceedToSquad, 
    hasSquadSelected = false,
    stats 
}) => {
    const [gameType, setGameType] = useState<'full' | 'kwikplay'>('full');
    const [format, setFormat] = useState<'t20' | 'odi' | 'ipl'>('t20');
    const [overs, setOvers] = useState(2);
    const [kwikPlayOvers, setKwikPlayOvers] = useState<1 | 2>(1);
    const [mode, setMode] = useState<'singlePlayer' | 'twoPlayer'>('singlePlayer');
    const [userTeam, setUserTeam] = useState('India');
    const [opponentTeam, setOpponentTeam] = useState('Australia');
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
    const [batFirst, setBatFirst] = useState<'bat' | 'bowl'>('bat');

    const availableTeams = format === 'ipl' ? iplTeamsData : teamsData;
    const oversOptions = [2, 4, 6, 10, 12, 20];

    const handleProceed = () => {
        if (onProceedToSquad) {
            onProceedToSquad(userTeam, opponentTeam);
        }
    };

    const handleStart = () => {
        onStart({
            gameType,
            format,
            overs: gameType === 'kwikplay' ? kwikPlayOvers : overs,
            kwikPlayOvers,
            mode,
            userTeam,
            opponentTeam,
            difficulty,
            batFirst
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header - with History button */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-2 text-center relative">
                <div className="text-xl font-bold text-white">⚡ Kwik Cricket</div>
                <div className="text-[10px] text-green-200">Fast-paced cricket action!</div>
                {/* History Button - positioned in top-right corner */}
                <Link 
                    to="/games/kwik-cricket/history"
                    className="absolute top-2 right-2 px-2 py-0.5 bg-white/20 hover:bg-white/30 text-white text-[10px] font-medium rounded transition"
                >
                    History
                </Link>
            </div>

            {/* Stats Bar - reduced padding */}
            {stats && (
                <div className="grid grid-cols-4 gap-1 p-2 bg-gray-50 dark:bg-gray-900/50 text-center border-b border-gray-200 dark:border-gray-700">
                    <div>
                        <div className="text-[8px] text-gray-500">Matches</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{stats.matches_played || 0}</div>
                    </div>
                    <div>
                        <div className="text-[8px] text-gray-500">Won</div>
                        <div className="text-sm font-bold text-green-600">{stats.matches_won || 0}</div>
                    </div>
                    <div>
                        <div className="text-[8px] text-gray-500">Highest</div>
                        <div className="text-sm font-bold text-yellow-600">{stats.highest_score || 0}</div>
                    </div>
                    <div>
                        <div className="text-[8px] text-gray-500">Win%</div>
                        <div className="text-sm font-bold text-blue-600">{stats.matches_played ? Math.round((stats.matches_won / stats.matches_played) * 100) : 0}%</div>
                    </div>
                </div>
            )}

            {/* Game Type Selection - reduced padding */}
            <div className="grid grid-cols-2 gap-1 p-2">
                <button 
                    onClick={() => setGameType('full')} 
                    className={`py-1.5 text-xs font-semibold rounded-lg transition ${gameType === 'full' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                    🏏 Full Match
                </button>
                <button 
                    onClick={() => setGameType('kwikplay')} 
                    className={`py-1.5 text-xs font-semibold rounded-lg transition ${gameType === 'kwikplay' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                    ⚡ Kwik Play
                </button>
            </div>

            {/* Format - only for Full Match, reduced padding */}
            {gameType === 'full' && (
                <div className="px-2 pb-1">
                    <div className="text-[9px] text-gray-500 mb-1">Format</div>
                    <div className="grid grid-cols-3 gap-1">
                        <button onClick={() => setFormat('t20')} className={`py-1 text-[10px] font-semibold rounded-lg transition ${format === 't20' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>⚡ T20</button>
                        <button onClick={() => setFormat('odi')} className={`py-1 text-[10px] font-semibold rounded-lg transition ${format === 'odi' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>🏏 ODI</button>
                        <button onClick={() => setFormat('ipl')} className={`py-1 text-[10px] font-semibold rounded-lg transition ${format === 'ipl' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>💪 IPL</button>
                    </div>
                </div>
            )}

            {/* Overs Selection - reduced padding */}
            <div className="px-2 pb-1">
                <div className="text-[9px] text-gray-500 mb-1">{gameType === 'full' ? 'Overs' : 'Super Over'}</div>
                {gameType === 'full' ? (
                    <div className="flex flex-wrap gap-1">
                        {oversOptions.map(o => (
                            <button key={o} onClick={() => setOvers(o)} className={`px-2 py-0.5 text-[10px] rounded-lg transition ${overs === o ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>{o}</button>
                        ))}
                    </div>
                ) : (
                    <div className="flex gap-1">
                        <button onClick={() => setKwikPlayOvers(1)} className={`flex-1 py-1 text-[10px] rounded-lg transition ${kwikPlayOvers === 1 ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>1 Over</button>
                        <button onClick={() => setKwikPlayOvers(2)} className={`flex-1 py-1 text-[10px] rounded-lg transition ${kwikPlayOvers === 2 ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>2 Overs</button>
                    </div>
                )}
            </div>

            {/* Mode - reduced padding */}
            <div className="px-2 pb-1">
                <div className="text-[9px] text-gray-500 mb-1">Mode</div>
                <div className="grid grid-cols-2 gap-1">
                    <button onClick={() => setMode('singlePlayer')} className={`py-1 text-[10px] rounded-lg transition ${mode === 'singlePlayer' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>🤖 Single</button>
                    <button onClick={() => setMode('twoPlayer')} className={`py-1 text-[10px] rounded-lg transition ${mode === 'twoPlayer' ? 'bg-yellow-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>👥 Two</button>
                </div>
            </div>

            {/* Teams - reduced padding */}
            <div className="px-2 pb-1">
                <div className="text-[9px] text-gray-500 mb-1">Teams</div>
                <div className="grid grid-cols-2 gap-1">
                    <select value={userTeam} onChange={(e) => setUserTeam(e.target.value)} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-600">
                        {availableTeams.map(team => <option key={team.id}>{team.name}</option>)}
                    </select>
                    <select value={opponentTeam} onChange={(e) => setOpponentTeam(e.target.value)} className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg px-2 py-1 border border-gray-200 dark:border-gray-600">
                        {availableTeams.filter(t => t.name !== userTeam).map(team => <option key={team.id}>{team.name}</option>)}
                    </select>
                </div>
            </div>

            {/* Squad Selection Button (only for full match) - reduced padding */}
            {gameType === 'full' && onProceedToSquad && (
                <div className="px-2 pb-1">
                    <button onClick={handleProceed} className="w-full py-1 bg-blue-600 text-white text-[10px] font-semibold rounded-lg hover:bg-blue-500 transition">
                        🏏 Select Squad →
                    </button>
                </div>
            )}

            {/* Squad Selection Status */}
            {gameType === 'full' && hasSquadSelected && (
                <div className="px-2 pb-1">
                    <div className="text-center text-[8px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 py-0.5 rounded-lg">
                        ✓ Squad selected!
                    </div>
                </div>
            )}

            {/* Difficulty - reduced padding */}
            {mode === 'singlePlayer' && (
                <div className="px-2 pb-1">
                    <div className="text-[9px] text-gray-500 mb-1">Difficulty</div>
                    <div className="grid grid-cols-3 gap-1">
                        <button onClick={() => setDifficulty('easy')} className={`py-1 text-[9px] rounded-lg transition ${difficulty === 'easy' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>🟢 Easy</button>
                        <button onClick={() => setDifficulty('medium')} className={`py-1 text-[9px] rounded-lg transition ${difficulty === 'medium' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>🟡 Medium</button>
                        <button onClick={() => setDifficulty('hard')} className={`py-1 text-[9px] rounded-lg transition ${difficulty === 'hard' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>🔴 Hard</button>
                    </div>
                </div>
            )}

            {/* Bat/Bowl - reduced padding */}
            {mode === 'singlePlayer' && gameType === 'full' && (
                <div className="px-2 pb-2">
                    <div className="text-[9px] text-gray-500 mb-1">Choose to</div>
                    <div className="grid grid-cols-2 gap-1">
                        <button onClick={() => setBatFirst('bat')} className={`py-1 text-[10px] rounded-lg transition ${batFirst === 'bat' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>🏏 Bat</button>
                        <button onClick={() => setBatFirst('bowl')} className={`py-1 text-[10px] rounded-lg transition ${batFirst === 'bowl' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>🎯 Bowl</button>
                    </div>
                </div>
            )}

            {/* Start Button - reduced padding */}
            <button 
                onClick={handleStart} 
                disabled={gameType === 'full' && onProceedToSquad && !hasSquadSelected}
                className="w-full py-2 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold text-sm hover:from-green-500 hover:to-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {gameType === 'kwikplay' ? '⚡ Start Kwik Play →' : '🏏 Start Match →'}
            </button>
        </div>
    );
};