// frontend/src/pages/Games/KwikCricket/components/KwikPlay.tsx
import React, { useState } from 'react';
import { getShotOutcome } from '../logic/shotOutcomes';
import { Player, getPlayersByCountry } from '../data/playersData';

interface KwikPlayProps {
    overs: number;
    userTeam: string;
    onEndMatch: (score: number, wickets: number) => void;
    onExit: () => void;
}

export const KwikPlay: React.FC<KwikPlayProps> = ({ 
    overs, 
    userTeam, 
    onEndMatch,
    onExit 
}) => {
    const [step, setStep] = useState<'select' | 'play'>('select');
    const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
    const [selectedBatsmen, setSelectedBatsmen] = useState<Player[]>([]);
    
    const [currentScore, setCurrentScore] = useState(0);
    const [currentWickets, setCurrentWickets] = useState(0);
    const [ballsBowled, setBallsBowled] = useState(0);
    const [commentary, setCommentary] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAnimation, setShowAnimation] = useState<{ type: string; runs: number } | null>(null);
    const [gameEnded, setGameEnded] = useState(false);
    
    // Batting stats
    const [battingStats, setBattingStats] = useState<{ player: Player; runs: number; balls: number; fours: number; sixes: number }[]>([]);
    
    const [currentBatsmanIndex, setCurrentBatsmanIndex] = useState(0);
    const [nonStrikerIndex, setNonStrikerIndex] = useState(1);

    // Load players when component mounts
    React.useEffect(() => {
        const players = getPlayersByCountry(userTeam);
        const batsmen = players.filter(p => p.role === 'batsman' || p.role === 'allrounder' || p.role === 'wicketkeeper');
        setAvailablePlayers(batsmen);
    }, [userTeam]);

    const togglePlayerSelection = (player: Player) => {
        if (selectedBatsmen.find(p => p.id === player.id)) {
            setSelectedBatsmen(selectedBatsmen.filter(p => p.id !== player.id));
        } else if (selectedBatsmen.length < 3) {
            setSelectedBatsmen([...selectedBatsmen, player]);
        }
    };

    const startKwikPlay = () => {
        if (selectedBatsmen.length === 3) {
            setBattingStats(selectedBatsmen.map(player => ({
                player,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0
            })));
            setStep('play');
            setCommentary([`⚡ Kwik Play Started!`, `${overs} over challenge`, `Batsmen: ${selectedBatsmen.map(p => p.name.split(' ')[0]).join(' → ')}`]);
        }
    };

    const totalBalls = overs * 6;
    const oversCompleted = Math.floor(ballsBowled / 6);
    const ballsInOver = ballsBowled % 6;
    const oversDisplay = `${oversCompleted}.${ballsInOver}`;
    const runRate = ballsBowled > 0 ? (currentScore / ballsBowled) * 6 : 0;

    const updateBattingStats = (runs: number, isWicket: boolean) => {
        const newStats = [...battingStats];
        const batsman = newStats[currentBatsmanIndex];
        if (batsman) {
            batsman.runs += runs;
            batsman.balls += 1;
            if (runs === 4) batsman.fours += 1;
            if (runs === 6) batsman.sixes += 1;
        }
        
        if (isWicket && currentWickets + 1 < 2) {
            setCurrentBatsmanIndex(currentWickets + 1);
            setNonStrikerIndex(currentWickets + 2);
        }
        
        return newStats;
    };

    const handleShot = (shotType: 'aggressive' | 'normal' | 'defensive') => {
        // End game at 2 wickets (super over rule - 3 batsmen, 2 wickets = all out)
        if (gameEnded || isProcessing || ballsBowled >= totalBalls || currentWickets >= 2) return;
        
        setIsProcessing(true);
        
        const result = getShotOutcome(shotType);
        
        setShowAnimation({ type: result.animation, runs: result.runs });
        setTimeout(() => setShowAnimation(null), 400);
        
        let newScore = currentScore;
        let newWickets = currentWickets;
        let newStats = [...battingStats];
        
        if (!result.isWicket) {
            newScore += result.runs;
            newStats = updateBattingStats(result.runs, false);
            if (result.runs % 2 === 1) {
                const temp = currentBatsmanIndex;
                setCurrentBatsmanIndex(nonStrikerIndex);
                setNonStrikerIndex(temp);
            }
        } else {
            newWickets += 1;
            newStats = updateBattingStats(0, true);
        }
        
        const newBallsBowled = ballsBowled + 1;
        const isEnd = newBallsBowled >= totalBalls || newWickets >= 2;
        
        const ballDisplay = `${oversCompleted}.${ballsInOver + 1}`;
        setCommentary(prev => [...prev, `${ballDisplay}: ${result.message}`]);
        
        if (isEnd) {
            setGameEnded(true);
            setCommentary(prev => [...prev, `🏏 ${userTeam} scored ${newScore}/${newWickets} in ${overs} over(s)!`]);
            onEndMatch(newScore, newWickets);
        } else {
            setCurrentScore(newScore);
            setCurrentWickets(newWickets);
            setBattingStats(newStats);
            setBallsBowled(newBallsBowled);
        }
        
        setIsProcessing(false);
    };

    const getAnimationClass = () => {
        if (!showAnimation) return '';
        if (showAnimation.type === 'six') return 'animate-bounce text-yellow-500 text-3xl';
        if (showAnimation.type === 'boundary') return 'animate-pulse text-green-500 text-3xl';
        if (showAnimation.type === 'wicket') return 'animate-shake text-red-500 text-3xl';
        return 'animate-fade text-blue-500 text-xl';
    };

    // Get rating based on score
    const getRating = (score: number, oversCount: number) => {
        const runsPerOver = score / oversCount;
        if (runsPerOver >= 20) return { text: '🔥 OUTSTANDING! 🔥', color: 'text-purple-600' };
        if (runsPerOver >= 15) return { text: '⭐ EXCELLENT! ⭐', color: 'text-green-600' };
        if (runsPerOver >= 10) return { text: '👍 GOOD EFFORT! 👍', color: 'text-blue-600' };
        if (runsPerOver >= 5) return { text: '📈 NEEDS IMPROVEMENT', color: 'text-yellow-600' };
        return { text: '💪 KEEP PRACTICING!', color: 'text-gray-500' };
    };

    // Batsmen Selection UI
    if (step === 'select') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-center">
                    <div className="text-xl font-bold text-white">⚡ KWIK PLAY</div>
                    <div className="text-xs text-orange-100">Select 3 Batsmen for {overs} Over Challenge</div>
                </div>

                <div className="p-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                        Select 3 Batsmen ({selectedBatsmen.length}/3)
                    </div>
                    
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {availablePlayers.map(player => {
                            const isSelected = selectedBatsmen.find(p => p.id === player.id);
                            return (
                                <div 
                                    key={player.id}
                                    onClick={() => togglePlayerSelection(player)}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                                        isSelected 
                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-500' 
                                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">{player.name}</div>
                                        <div className="text-xs text-gray-500">{player.role} • Bat: {player.battingAbility}</div>
                                    </div>
                                    {isSelected && (
                                        <div className="text-green-600 text-sm font-semibold">✓ Selected</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onExit} className="flex-1 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-400 transition">
                        ← Back
                    </button>
                    <button 
                        onClick={startKwikPlay}
                        disabled={selectedBatsmen.length !== 3}
                        className="flex-1 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-sm rounded-lg hover:from-orange-500 hover:to-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Start Kwik Play →
                    </button>
                </div>
            </div>
        );
    }

    // Game Play UI
    const currentBatsman = battingStats[currentBatsmanIndex];
    const nonStriker = battingStats[nonStrikerIndex];
    const isGameOver = gameEnded || ballsBowled >= totalBalls || currentWickets >= 2;

    if (isGameOver) {
        const rating = getRating(currentScore, overs);
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-center">
                    <div className="text-2xl font-bold text-white">⚡ KWIK PLAY COMPLETE!</div>
                </div>
                
                <div className="p-6 text-center">
                    <div className="text-6xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                        {currentScore}/{currentWickets}
                    </div>
                    <div className="text-sm text-gray-500 mb-4">{overs} over(s) • {totalBalls - ballsBowled} balls remaining</div>
                    
                    <div className={`text-xl font-bold ${rating.color} mb-6`}>
                        {rating.text}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 mb-6">
                        <div className="text-xs text-gray-500">Batting Summary</div>
                        <div className="space-y-1 mt-2">
                            {battingStats.map((b, i) => (
                                <div key={i} className="text-sm">
                                    {b.player.name}: {b.runs} ({b.balls}) • {b.fours} fours • {b.sixes} sixes
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button onClick={() => {
                            setStep('select');
                            setSelectedBatsmen([]);
                            setCurrentScore(0);
                            setCurrentWickets(0);
                            setBallsBowled(0);
                            setCommentary([]);
                            setGameEnded(false);
                        }} className="flex-1 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition">
                            Play Again
                        </button>
                        <button onClick={onExit} className="flex-1 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-400 transition">
                            Main Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            {showAnimation && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-full shadow-lg text-lg font-bold ${getAnimationClass()}`}>
                    {showAnimation.type === 'six' && '💥 SIX!'}
                    {showAnimation.type === 'boundary' && '🏏 FOUR!'}
                    {showAnimation.type === 'wicket' && '🎯 WICKET!'}
                    {showAnimation.type === 'dot' && '⚫ DOT BALL'}
                </div>
            )}

            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 py-2 text-center text-white">
                <div className="font-bold">⚡ KWIK PLAY</div>
                <div className="text-xs opacity-90">{overs} Over • 3 Batsmen • 2 Wickets = All Out</div>
            </div>

            {/* Score Card */}
            <div className="p-4 text-center border-b border-gray-200 dark:border-gray-700">
                <div className="text-5xl font-bold text-gray-900 dark:text-white">{currentScore}/{currentWickets}</div>
                <div className="text-sm text-gray-500 mt-1">Overs: {oversDisplay} / {overs} • RR: {runRate.toFixed(2)}</div>
                <div className="text-xs text-red-500 mt-1">{(currentWickets >= 2) ? 'All Out!' : `${2 - currentWickets} wickets remaining`}</div>
            </div>

            {/* Current Batsmen */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 mb-2">🏏 CURRENT BATSMEN</div>
                <div className="flex justify-between">
                    <div>
                        <div className="font-semibold text-gray-900 dark:text-white">{currentBatsman?.player.name}</div>
                        <div className="text-xs text-gray-500">{currentBatsman?.runs} ({currentBatsman?.balls}) • {currentBatsman?.fours} fours • {currentBatsman?.sixes} sixes</div>
                    </div>
                    <div className="text-right">
                        <div className="font-semibold text-gray-900 dark:text-white">{nonStriker?.player.name}</div>
                        <div className="text-xs text-gray-500">{nonStriker?.runs} ({nonStriker?.balls})</div>
                    </div>
                </div>
            </div>

            {/* Shot Selection */}
            <div className="grid grid-cols-3 gap-2 p-4">
                <button onClick={() => handleShot('aggressive')} disabled={isProcessing} className="py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition disabled:opacity-50 text-sm">💥 AGGRESSIVE</button>
                <button onClick={() => handleShot('normal')} disabled={isProcessing} className="py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition disabled:opacity-50 text-sm">⚖️ NORMAL</button>
                <button onClick={() => handleShot('defensive')} disabled={isProcessing} className="py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition disabled:opacity-50 text-sm">🛡️ DEFENSIVE</button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 dark:bg-gray-900/50 text-center text-xs">
                <div>
                    <div className="text-gray-500">Balls Left</div>
                    <div className="font-bold text-gray-900 dark:text-white">{totalBalls - ballsBowled}</div>
                </div>
                <div>
                    <div className="text-gray-500">Current RR</div>
                    <div className="font-bold text-gray-900 dark:text-white">{runRate.toFixed(2)}</div>
                </div>
                <div>
                    <div className="text-gray-500">Wickets Left</div>
                    <div className="font-bold text-red-600">{2 - currentWickets}</div>
                </div>
            </div>

            {/* Batting Order */}
            <div className="p-2 text-center text-[10px] text-gray-400 border-t border-gray-200 dark:border-gray-700">
                Batting: {battingStats.map((b, i) => (
                    <span key={i} className={i === currentBatsmanIndex ? 'font-bold text-green-600 mx-1' : i === nonStrikerIndex ? 'text-blue-500 mx-1' : 'mx-1'}>
                        {b.player.name.split(' ')[0]}
                        {i < battingStats.length - 1 && ' →'}
                    </span>
                ))}
            </div>

            {/* Commentary */}
            <div className="p-3 bg-gray-50 dark:bg-gray-900/50 h-28 overflow-y-auto border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 mb-1">📝 COMMENTARY</div>
                {commentary.slice(-5).map((text, idx) => (
                    <div key={idx} className="text-xs text-gray-700 dark:text-gray-300 py-0.5">{text}</div>
                ))}
            </div>

            {/* Exit Button */}
            <button onClick={onExit} className="w-full py-2 bg-gray-500 text-white text-sm font-medium hover:bg-gray-400 transition">
                ← Exit Kwik Play
            </button>
        </div>
    );
};