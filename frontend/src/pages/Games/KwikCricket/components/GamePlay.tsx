// frontend/src/pages/Games/KwikCricket/components/GamePlay.tsx
import React, { useState, useEffect } from 'react';
import { getShotOutcome } from '../logic/shotOutcomes';
import { bowlBall } from '../logic/aiBowling';
import { Scorecard } from './Scorecard';
import { Player } from '../data/playersData';

interface BattingStats {
    player: Player;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    dismissal: string;
    strikeRate: number;
}

interface BowlingStats {
    player: Player;
    overs: number;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
    ballsInCurrentOver: number;
}

interface GamePlayProps {
    matchState: any;
    userSquad: Player[];
    opponentSquad: Player[];
    battingOrder: Player[];
    onUpdate: (updates: any) => void;
    onEndMatch: (result: string, winner: string, margin: string, userScore: number, userWickets: number, opponentScore: number, opponentWickets: number, userBattingStats: BattingStats[], userBowlingStats: BowlingStats[], opponentBattingStats: BattingStats[], opponentBowlingStats: BowlingStats[]) => void;
    onRunsMilestone?: (runs: number) => void;
    onWicketsMilestone?: (wickets: number) => void;
}

// Helper function to format overs from balls bowled
const formatOvers = (ballsBowled: number): string => {
    const overs = Math.floor(ballsBowled / 6);
    const balls = ballsBowled % 6;
    return `${overs}.${balls}`;
};

// Animation helper
const getAnimationClass = (showAnimation: { type: string; runs: number } | null) => {
    if (!showAnimation) return '';
    if (showAnimation.type === 'six') return 'animate-bounce text-yellow-500 text-2xl';
    if (showAnimation.type === 'boundary') return 'animate-pulse text-green-500 text-2xl';
    if (showAnimation.type === 'wicket') return 'animate-shake text-red-500 text-2xl';
    return 'animate-fade text-blue-500 text-xl';
};

export const GamePlay: React.FC<GamePlayProps> = ({ 
    matchState, 
    userSquad, 
    opponentSquad, 
    battingOrder,
    onUpdate, 
    onEndMatch 
}) => {
    const [activeTab, setActiveTab] = useState<'team1' | 'team2' | 'commentary'>('team1');
    
    // Game state
    const [isUserInnings, setIsUserInnings] = useState(matchState.currentInnings === 'user');
    const [currentScore, setCurrentScore] = useState(isUserInnings ? matchState.userScore : matchState.opponentScore);
    const [currentWickets, setCurrentWickets] = useState(isUserInnings ? matchState.userWickets : matchState.opponentWickets);
    const [ballsBowled, setBallsBowled] = useState(matchState.ballsBowled || 0);
    const [commentary, setCommentary] = useState([...matchState.commentary]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAnimation, setShowAnimation] = useState<{ type: string; runs: number } | null>(null);
    const [target, setTarget] = useState(matchState.target);
    const [userInningsComplete, setUserInningsComplete] = useState(matchState.userInningsComplete || false);
    const [gameEnded, setGameEnded] = useState(false);
    
    // Bowler selection state
    const [showBowlerSelection, setShowBowlerSelection] = useState(false);
    const [selectedBowlerIndex, setSelectedBowlerIndex] = useState<number | null>(null);
    
    // Batting stats
    const [userBattingStats, setUserBattingStats] = useState<BattingStats[]>(() => {
        if (matchState.userBattingStats && matchState.userBattingStats.length > 0) {
            return matchState.userBattingStats;
        }
        return battingOrder.map(player => ({
            player,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            dismissal: 'not out',
            strikeRate: 0
        }));
    });
    
    const [opponentBattingStats, setOpponentBattingStats] = useState<BattingStats[]>(() => {
        if (matchState.opponentBattingStats && matchState.opponentBattingStats.length > 0) {
            return matchState.opponentBattingStats;
        }
        return opponentSquad.map(player => ({
            player,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            dismissal: 'not out',
            strikeRate: 0
        }));
    });
    
    // Bowling stats
    const userBowlers = userSquad.filter(p => p.role === 'bowler' || p.role === 'allrounder');
    const opponentBowlers = opponentSquad.filter(p => p.role === 'bowler' || p.role === 'allrounder');
    
    const [userBowlingStats, setUserBowlingStats] = useState<BowlingStats[]>(() => {
        if (matchState.userBowlingStats && matchState.userBowlingStats.length > 0) {
            return matchState.userBowlingStats;
        }
        return userBowlers.map(player => ({
            player,
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0,
            economy: 0,
            ballsInCurrentOver: 0
        }));
    });
    
    const [opponentBowlingStats, setOpponentBowlingStats] = useState<BowlingStats[]>(() => {
        if (matchState.opponentBowlingStats && matchState.opponentBowlingStats.length > 0) {
            return matchState.opponentBowlingStats;
        }
        return opponentBowlers.map(player => ({
            player,
            overs: 0,
            maidens: 0,
            runs: 0,
            wickets: 0,
            economy: 0,
            ballsInCurrentOver: 0
        }));
    });
    
    // Current batsman and bowler indices
    const [currentBatsmanIndex, setCurrentBatsmanIndex] = useState(0);
    const [nonStrikerIndex, setNonStrikerIndex] = useState(1);
    const [currentBowlerIndex, setCurrentBowlerIndex] = useState(0);

    const totalBalls = matchState.overs * 6;
    const oversCompleted = Math.floor(ballsBowled / 6);
    const ballsInOver = ballsBowled % 6;
    const oversDisplay = formatOvers(ballsBowled);
    const runRate = ballsBowled > 0 ? (currentScore / ballsBowled) * 6 : 0;

    // Show bowler selection only at start of innings OR when over is complete
    useEffect(() => {
    if (!isUserInnings && !userInningsComplete && !gameEnded) {
        // Show bowler selection at start of innings OR when over is complete and not already showing
        const isStartOfInnings = ballsBowled === 0;
        const isJustCompletedOver = ballsInOver === 0 && ballsBowled > 0;
        
        if ((isStartOfInnings || isJustCompletedOver) && !showBowlerSelection && selectedBowlerIndex === null) {
            setShowBowlerSelection(true);
        }
    }
}, [ballsBowled, ballsInOver, isUserInnings, userInningsComplete, gameEnded]);

    // Get current batsman
    const getCurrentBatsman = () => {
        if (isUserInnings) {
            return userBattingStats[currentBatsmanIndex];
        } else {
            return opponentBattingStats[currentBatsmanIndex];
        }
    };

    // Get yet to bat players
    const getYetToBat = () => {
        if (isUserInnings) {
            const battedCount = currentWickets + 2;
            return userBattingStats.slice(battedCount);
        } else {
            const battedCount = currentWickets + 2;
            return opponentBattingStats.slice(battedCount);
        }
    };

    // Get batted players
    const getBattedPlayers = () => {
        if (isUserInnings) {
            const battedCount = currentWickets + 2;
            return userBattingStats.slice(0, Math.min(battedCount, userBattingStats.length));
        } else {
            const battedCount = currentWickets + 2;
            return opponentBattingStats.slice(0, Math.min(battedCount, opponentBattingStats.length));
        }
    };

    // Update batting stats
    const updateBattingStats = (runs: number, isWicket: boolean, batsmanIdx: number, isUser: boolean): { newStats: BattingStats[], newBatsmanIndex: number } => {
        if (isUser) {
            const newStats = [...userBattingStats];
            const batsman = newStats[batsmanIdx];
            if (batsman) {
                batsman.runs += runs;
                batsman.balls += 1;
                if (runs === 4) batsman.fours += 1;
                if (runs === 6) batsman.sixes += 1;
                batsman.strikeRate = Math.round((batsman.runs / batsman.balls) * 100);
                if (isWicket) batsman.dismissal = 'b ' + (opponentBowlingStats[currentBowlerIndex]?.player?.name || 'Bowler');
            }
            
            if (isWicket) {
                return { newStats, newBatsmanIndex: batsmanIdx + 1 };
            }
            return { newStats, newBatsmanIndex: batsmanIdx };
        } else {
            const newStats = [...opponentBattingStats];
            const batsman = newStats[batsmanIdx];
            if (batsman) {
                batsman.runs += runs;
                batsman.balls += 1;
                if (runs === 4) batsman.fours += 1;
                if (runs === 6) batsman.sixes += 1;
                batsman.strikeRate = Math.round((batsman.runs / batsman.balls) * 100);
                if (isWicket) batsman.dismissal = 'b ' + (userBowlingStats[currentBowlerIndex]?.player?.name || 'Bowler');
            }
            
            if (isWicket) {
                return { newStats, newBatsmanIndex: batsmanIdx + 1 };
            }
            return { newStats, newBatsmanIndex: batsmanIdx };
        }
    };

    // Update bowling stats
    const updateBowlingStats = (runs: number, isWicket: boolean, bowlerIdx: number, isUserBowling: boolean): BowlingStats[] => {
    if (isUserBowling) {
        const newStats = [...userBowlingStats];
        const bowler = newStats[bowlerIdx];
        if (bowler) {
            bowler.runs += runs;
            if (isWicket) bowler.wickets += 1;
            bowler.ballsInCurrentOver += 1;
            if (bowler.ballsInCurrentOver === 6) {
                bowler.overs += 1;
                bowler.ballsInCurrentOver = 0;
            }
            bowler.economy = bowler.overs > 0 ? bowler.runs / bowler.overs : 0;
        }
        return newStats;
    } else {
        const newStats = [...opponentBowlingStats];
        const bowler = newStats[bowlerIdx];
        if (bowler) {
            bowler.runs += runs;
            if (isWicket) bowler.wickets += 1;
            bowler.ballsInCurrentOver += 1;
            if (bowler.ballsInCurrentOver === 6) {
                bowler.overs += 1;
                bowler.ballsInCurrentOver = 0;
            }
            bowler.economy = bowler.overs > 0 ? bowler.runs / bowler.overs : 0;
        }
        return newStats;
    }
};


    // Handle strike rotation
    const handleStrikeRotation = (runs: number) => {
        if (runs % 2 === 1) {
            const temp = currentBatsmanIndex;
            setCurrentBatsmanIndex(nonStrikerIndex);
            setNonStrikerIndex(temp);
        }
    };

    // Handle wicket
    const handleWicket = (newBatsmanIndex: number) => {
        setCurrentBatsmanIndex(newBatsmanIndex);
        setNonStrikerIndex(newBatsmanIndex + 1);
    };

    // Select bowler
    const selectBowler = (index: number) => {
        setSelectedBowlerIndex(index);
        setCurrentBowlerIndex(index);
        setShowBowlerSelection(false);
    };

    // Get shot outcome with player ability
    const getPlayerShotOutcome = (player: Player, shotType: 'aggressive' | 'normal' | 'defensive') => {
        const result = getShotOutcome(shotType);
        const abilityMod = player.battingAbility / 100;
        
        if (result.runs >= 4 && Math.random() > abilityMod) {
            result.runs = Math.max(1, result.runs - 2);
            result.message = "Edge! But safe!";
        }
        if (result.isWicket && Math.random() < abilityMod * 0.3) {
            result.isWicket = false;
            result.runs = 0;
            result.message = "Inside edge! Survived!";
        }
        return result;
    };

    // Get bowling outcome with bowler ability
    const getBowlerOutcome = (bowler: Player, overNum: number, ballNum: number) => {
        const result = bowlBall(matchState.difficulty, overNum, ballNum, matchState.overs);
        const abilityMod = bowler.bowlingAbility / 100;
        
        if (result.isWicket && Math.random() < abilityMod * 0.2) {
            result.message = "Perfect delivery! " + result.message;
        }
        return result;
    };

    // Handle batting shot
    const handleBattingShot = (shotType: 'aggressive' | 'normal' | 'defensive') => {
        if (gameEnded || isProcessing || userInningsComplete) return;
        
        if (ballsBowled >= totalBalls || currentWickets >= 10) {
            completeUserInnings();
            return;
        }
        
        setIsProcessing(true);
        
        const currentPlayer = getCurrentBatsman()?.player;
        if (!currentPlayer) {
            setIsProcessing(false);
            return;
        }
        
        const result = getPlayerShotOutcome(currentPlayer, shotType);
        
        setShowAnimation({ type: result.animation, runs: result.runs });
        setTimeout(() => setShowAnimation(null), 400);
        
        let newScore = currentScore;
        let newWickets = currentWickets;
        let newStats = [...userBattingStats];
        let newBowlerStats = [...opponentBowlingStats];
        
        if (!result.isWicket) {
            newScore += result.runs;
            const updateResult = updateBattingStats(result.runs, false, currentBatsmanIndex, true);
            newStats = updateResult.newStats;
            handleStrikeRotation(result.runs);
        } else {
            newWickets += 1;
            const updateResult = updateBattingStats(0, true, currentBatsmanIndex, true);
            newStats = updateResult.newStats;
            handleWicket(updateResult.newBatsmanIndex);
        }
        
        newBowlerStats = updateBowlingStats(result.runs, result.isWicket, currentBowlerIndex, false);
        
        const newBallsBowled = ballsBowled + 1;
        const isInningsEnd = newBallsBowled >= totalBalls || newWickets >= 10;
        
        const ballDisplay = `${oversCompleted}.${ballsInOver + 1}`;
        setCommentary(prev => [...prev, `${ballDisplay}: ${result.message}`]);
        
        if (isInningsEnd) {
            setCurrentScore(newScore);
            setCurrentWickets(newWickets);
            setUserBattingStats(newStats);
            setOpponentBowlingStats(newBowlerStats);
            setBallsBowled(newBallsBowled);
            completeUserInnings(newScore, newWickets, newStats, newBowlerStats);
        } else {
            setCurrentScore(newScore);
            setCurrentWickets(newWickets);
            setUserBattingStats(newStats);
            setOpponentBowlingStats(newBowlerStats);
            setBallsBowled(newBallsBowled);
            
            onUpdate({
                userScore: newScore,
                userWickets: newWickets,
                ballsBowled: newBallsBowled,
                commentary: [...commentary, `${ballDisplay}: ${result.message}`],
                userBattingStats: newStats,
                opponentBowlingStats: newBowlerStats
            });
        }
        
        setIsProcessing(false);
    };

    // Handle bowling ball
    const handleBowlingBall = () => {
        if (gameEnded || isProcessing) return;
        if (showBowlerSelection || selectedBowlerIndex === null) return;
        
        if (ballsBowled >= totalBalls || currentWickets >= 10 || currentScore >= target) {
            completeMatch();
            return;
        }
        
        const currentBowler = userBowlingStats[currentBowlerIndex]?.player;
        if (!currentBowler) {
            setIsProcessing(false);
            return;
        }
        
        setIsProcessing(true);
        
        const result = getBowlerOutcome(currentBowler, oversCompleted + 1, ballsInOver + 1);
        
        setShowAnimation({ type: result.animation, runs: result.runs });
        setTimeout(() => setShowAnimation(null), 400);
        
        let newScore = currentScore;
        let newWickets = currentWickets;
        let newStats = [...opponentBattingStats];
        let newBowlerStats = [...userBowlingStats];
        
        if (!result.isWicket) {
            newScore += result.runs;
            const updateResult = updateBattingStats(result.runs, false, currentBatsmanIndex, false);
            newStats = updateResult.newStats;
            handleStrikeRotation(result.runs);
        } else {
            newWickets += 1;
            const updateResult = updateBattingStats(0, true, currentBatsmanIndex, false);
            newStats = updateResult.newStats;
            handleWicket(updateResult.newBatsmanIndex);
        }
        
        newBowlerStats = updateBowlingStats(result.runs, result.isWicket, currentBowlerIndex, true);
        
        const newBallsBowled = ballsBowled + 1;
        const isTargetReached = newScore >= target;
        const isInningsEnd = newBallsBowled >= totalBalls || newWickets >= 10 || isTargetReached;
        
        const ballDisplay = `${oversCompleted}.${ballsInOver + 1}`;
        setCommentary(prev => [...prev, `${ballDisplay}: ${result.message}`]);
        
        if (isInningsEnd) {
            setCurrentScore(newScore);
            setCurrentWickets(newWickets);
            setOpponentBattingStats(newStats);
            setUserBowlingStats(newBowlerStats);
            completeMatch(newScore, newWickets, newStats, newBowlerStats);
        } else {
            setCurrentScore(newScore);
            setCurrentWickets(newWickets);
            setOpponentBattingStats(newStats);
            setUserBowlingStats(newBowlerStats);
            setBallsBowled(newBallsBowled);
            
            onUpdate({
                opponentScore: newScore,
                opponentWickets: newWickets,
                ballsBowled: newBallsBowled,
                commentary: [...commentary, `${ballDisplay}: ${result.message}`],
                opponentBattingStats: newStats,
                userBowlingStats: newBowlerStats
            });
        }
        
        setIsProcessing(false);
    };

    // Skip innings (auto-complete remaining)
    const skipInnings = () => {
        if (gameEnded || isProcessing) return;
        
        let simScore = currentScore;
        let simWickets = currentWickets;
        let simBallsBowled = ballsBowled;
        let simBattingStats = [...opponentBattingStats];
        let simBowlingStats = [...userBowlingStats];
        let simBatsmanIdx = currentBatsmanIndex;
        let simBowlerIdx = currentBowlerIndex;
        
        while (simBallsBowled < totalBalls && simWickets < 10 && simScore < target) {
            const overNum = Math.floor(simBallsBowled / 6) + 1;
            const ballNum = (simBallsBowled % 6) + 1;
            const result = bowlBall(matchState.difficulty, overNum, ballNum, matchState.overs);
            
            if (!result.isWicket) {
                simScore += result.runs;
                const updateResult = updateBattingStats(result.runs, false, simBatsmanIdx, false);
                simBattingStats = updateResult.newStats;
                if (result.runs % 2 === 1) {
                    simBatsmanIdx = simBatsmanIdx === 0 ? 1 : 0;
                }
            } else {
                simWickets += 1;
                const updateResult = updateBattingStats(0, true, simBatsmanIdx, false);
                simBattingStats = updateResult.newStats;
                simBatsmanIdx = updateResult.newBatsmanIndex;
            }
            
            const bowler = simBowlingStats[simBowlerIdx];
            if (bowler) {
                bowler.runs += result.runs;
                if (result.isWicket) bowler.wickets += 1;
                bowler.ballsInCurrentOver += 1;
                if (bowler.ballsInCurrentOver === 6) {
                    bowler.overs += 1;
                    bowler.ballsInCurrentOver = 0;
                    simBowlerIdx = (simBowlerIdx + 1) % simBowlingStats.length;
                }
                bowler.economy = bowler.overs > 0 ? bowler.runs / bowler.overs : 0;
            }
            
            simBallsBowled += 1;
        }
        
        const won = simScore < target;
        const margin = won ? `${target - simScore} runs` : `${10 - simWickets} wickets`;
        const winner = won ? matchState.userTeam : matchState.opponentTeam;
        
        onEndMatch(won ? 'win' : 'loss', winner, margin,
            matchState.userScore, matchState.userWickets, simScore, simWickets,
            matchState.userBattingStats || userBattingStats, matchState.userBowlingStats || userBowlingStats, 
            simBattingStats, simBowlingStats);
    };

    // Complete user innings
    const completeUserInnings = (finalScore?: number, finalWickets?: number, finalBattingStats?: BattingStats[], finalBowlingStats?: BowlingStats[]) => {
        const score = finalScore !== undefined ? finalScore : currentScore;
        const wickets = finalWickets !== undefined ? finalWickets : currentWickets;
        const battingStats = finalBattingStats || userBattingStats;
        const bowlingStats = finalBowlingStats || opponentBowlingStats;
        
        setUserInningsComplete(true);
        setIsUserInnings(false);
        
        const newTarget = score + 1;
        setTarget(newTarget);
        
        setCurrentScore(0);
        setCurrentWickets(0);
        setBallsBowled(0);
        setCurrentBatsmanIndex(0);
        setNonStrikerIndex(1);
        setShowBowlerSelection(true);
        setSelectedBowlerIndex(null);
        
        setCommentary(prev => [...prev, `📊 ${matchState.userTeam} scored ${score}/${wickets}`, `🎯 Target: ${newTarget} runs for ${matchState.opponentTeam}`]);
        
        onUpdate({
            userScore: score,
            userWickets: wickets,
            currentInnings: 'opponent',
            target: newTarget,
            ballsBowled: 0,
            userBattingStats: battingStats,
            userBowlingStats: bowlingStats,
            userInningsComplete: true,
            commentary: [...commentary, `📊 ${matchState.userTeam} scored ${score}/${wickets}`, `🎯 Target: ${newTarget}`]
        });
    };

    // Complete match
    const completeMatch = (finalOpponentScore?: number, finalOpponentWickets?: number, finalBattingStats?: BattingStats[], finalBowlingStats?: BowlingStats[]) => {
        const opponentScore = finalOpponentScore !== undefined ? finalOpponentScore : currentScore;
        const opponentWickets = finalOpponentWickets !== undefined ? finalOpponentWickets : currentWickets;
        const opponentBattingStatsData = finalBattingStats || opponentBattingStats;
        const userBowlingStatsData = finalBowlingStats || userBowlingStats;
        
        const userScoreValue = matchState.userScore;
        const userWicketsValue = matchState.userWickets;
        const userBattingStatsData = matchState.userBattingStats || userBattingStats;
        const opponentBowlingStatsData = matchState.opponentBowlingStats || opponentBowlingStats;
        
        const won = opponentScore < target;
        let margin = '';
        let winner = '';
        
        if (won) {
            margin = `${target - opponentScore} runs`;
            winner = matchState.userTeam;
        } else {
            margin = `${10 - opponentWickets} wickets`;
            winner = matchState.opponentTeam;
        }
        
        setGameEnded(true);
        setCommentary(prev => [...prev, won ? `🏆 ${matchState.userTeam} wins by ${margin}!` : `${matchState.opponentTeam} wins by ${margin}!`]);
        
        onEndMatch(won ? 'win' : 'loss', winner, margin, 
    userScoreValue, userWicketsValue, opponentScore, opponentWickets,
    userBattingStatsData,    // User's batting stats
    userBowlingStatsData,    // User's bowling stats (USER's bowlers)
    opponentBattingStatsData, // Opponent's batting stats
    opponentBowlingStatsData  // Opponent's bowling stats (OPPONENT's bowlers)
);
    };

    // User batting innings UI
    if (!userInningsComplete && !gameEnded && isUserInnings) {
        const activeBatsman = getCurrentBatsman();
        const yetToBat = getYetToBat();
        const battedPlayers = getBattedPlayers();
        
        return (
            <div className="space-y-3">
                {showAnimation && (
                    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white px-3 py-1.5 rounded-full shadow-lg text-sm font-bold ${getAnimationClass(showAnimation)}`}>
                        {showAnimation.type === 'six' && '💥 SIX!'}
                        {showAnimation.type === 'boundary' && '🏏 FOUR!'}
                        {showAnimation.type === 'wicket' && '🎯 WICKET!'}
                        {showAnimation.type === 'dot' && '⚫ DOT BALL'}
                    </div>
                )}

                {/* Score Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{currentScore}/{currentWickets}</div>
                    <div className="text-xs text-gray-500">Overs: {oversDisplay} / {matchState.overs} • RR: {runRate.toFixed(2)}</div>
                    {activeBatsman && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            🏏 {activeBatsman.player.name}: {activeBatsman.runs} ({activeBatsman.balls}) • SR: {activeBatsman.strikeRate}
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleBattingShot('aggressive')} disabled={isProcessing} className="py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-500 transition disabled:opacity-50">💥 AGR</button>
                    <button onClick={() => handleBattingShot('normal')} disabled={isProcessing} className="py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 transition disabled:opacity-50">⚖️ NOR</button>
                    <button onClick={() => handleBattingShot('defensive')} disabled={isProcessing} className="py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-500 transition disabled:opacity-50">🛡️ DEF</button>
                </div>

                {/* Scorecard Tab */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button onClick={() => setActiveTab('team1')} className={`flex-1 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'team1' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>🏏 {matchState.userTeam}</button>
                        <button onClick={() => setActiveTab('team2')} className="flex-1 px-3 py-2 text-sm font-medium text-gray-400">🏏 {matchState.opponentTeam}</button>
                        <button onClick={() => setActiveTab('commentary')} className="flex-1 px-3 py-2 text-sm font-medium text-gray-400">📝 Commentary</button>
                    </div>
                    <div className="p-3">
                        {activeTab === 'team1' && (
                            <>
                                <Scorecard 
                                    teamName={matchState.userTeam}
                                    battingStats={battedPlayers.map(s => ({ 
                                        name: s.player.name, 
                                        runs: s.runs, 
                                        balls: s.balls, 
                                        fours: s.fours, 
                                        sixes: s.sixes, 
                                        dismissal: s.dismissal,
                                        strikeRate: s.strikeRate
                                    }))}
                                    bowlingStats={opponentBowlingStats.map(s => ({ 
                                        name: s.player.name, 
                                        overs: s.overs + (s.ballsInCurrentOver / 6), 
                                        maidens: s.maidens, 
                                        runs: s.runs, 
                                        wickets: s.wickets, 
                                        economy: s.economy 
                                    }))}
                                    total={currentScore}
                                    wickets={currentWickets}
                                    overs={ballsBowled / 6}
                                />
                                
                                {yetToBat.length > 0 && yetToBat.some(b => b.balls === 0 && b.runs === 0) && (
                                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/30 rounded">
                                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">⏳ Yet to Bat</div>
                                        <div className="flex flex-wrap gap-1">
                                            {yetToBat.filter(b => b.balls === 0 && b.runs === 0).map((batsman, idx) => (
                                                <span key={idx} className="text-[10px] px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                                    {batsman.player.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {activeTab === 'team2' && (
                            <div className="text-center text-gray-500 py-8">
                                {matchState.opponentTeam} will bat after this innings
                            </div>
                        )}
                        {activeTab === 'commentary' && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 h-64 overflow-y-auto">
                                <div className="text-xs text-gray-500 mb-2">📝 FULL COMMENTARY</div>
                                {commentary.map((text: string, idx: number) => (
                                    <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-800">{text}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Opponent batting innings UI
    if (userInningsComplete && !gameEnded) {
        const runsNeeded = target - currentScore;
        const ballsLeft = totalBalls - ballsBowled;
        const currentBowler = userBowlingStats[currentBowlerIndex]?.player;
        const activeBatsman = getCurrentBatsman();
        const yetToBat = getYetToBat();
        const battedPlayers = getBattedPlayers();
        
        return (
            <div className="space-y-3">
                {/* Bowler Selection Modal */}
                {showBowlerSelection && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-80 max-w-sm">
                            <h3 className="text-lg font-bold mb-3 text-gray-900 dark:text-white">Select Bowler</h3>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {userBowlingStats.map((bowler, idx) => {
                                    // Show all bowlers, but indicate who is available
                                    const isCurrentlyBowling = bowler.ballsInCurrentOver > 0 && bowler.ballsInCurrentOver < 6;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => selectBowler(idx)}
                                            className={`w-full p-2 text-left rounded-lg transition ${
                                                isCurrentlyBowling 
                                                    ? 'bg-yellow-100 dark:bg-yellow-900/30 cursor-not-allowed opacity-50'
                                                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                                            }`}
                                            disabled={isCurrentlyBowling}
                                        >
                                            <div className="font-medium text-gray-900 dark:text-white text-sm">{bowler.player.name}</div>
                                            <div className="text-xs text-gray-500">
                                                Overs: {Math.floor(bowler.overs)}.{bowler.ballsInCurrentOver} • Wickets: {bowler.wickets} • Economy: {bowler.economy.toFixed(2)}
                                                {isCurrentlyBowling && <span className="ml-2 text-yellow-600">(Currently bowling)</span>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="mt-3 text-xs text-gray-500 text-center">
                                💡 Select a bowler to start the over
                            </div>
                        </div>
                    </div>
                )}

                {showAnimation && (
                    <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gray-900 text-white px-3 py-1.5 rounded-full shadow-lg text-sm font-bold ${getAnimationClass(showAnimation)}`}>
                        {showAnimation.type === 'six' && '💥 SIX!'}
                        {showAnimation.type === 'boundary' && '🏏 FOUR!'}
                        {showAnimation.type === 'wicket' && '🎯 WICKET!'}
                    </div>
                )}

                {/* Target Display */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-2 text-center border border-yellow-200 dark:border-yellow-800">
                    <div className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">Target: {target} runs to win</div>
                </div>

                {/* Score Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">{currentScore}/{currentWickets}</div>
                    <div className="text-xs text-gray-500">Overs: {oversDisplay} / {matchState.overs} • RR: {runRate.toFixed(2)}</div>
                    <div className="text-xs font-semibold text-red-600 dark:text-red-400 mt-1">Need {runsNeeded} runs in {ballsLeft} balls</div>
                    {activeBatsman && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            🏏 {activeBatsman.player.name}: {activeBatsman.runs} ({activeBatsman.balls}) • SR: {activeBatsman.strikeRate}
                        </div>
                    )}
                    {currentBowler && !showBowlerSelection && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            🎯 Current Bowler: {currentBowler.name}
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="space-y-2">
                    <button 
                        onClick={() => setShowBowlerSelection(true)}
                        disabled={isProcessing}
                        className="w-full py-1.5 bg-orange-600 text-white text-xs rounded-lg hover:bg-orange-500 transition"
                    >
                        🎯 SELECT BOWLER
                    </button>
                    <button 
                        onClick={handleBowlingBall} 
                        disabled={isProcessing || showBowlerSelection || (selectedBowlerIndex === null)}
                        className="w-full py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        🎯 BOWL NEXT BALL
                    </button>
                    <button onClick={skipInnings} disabled={isProcessing} className="w-full py-1.5 bg-gray-500 text-white text-xs rounded-lg hover:bg-gray-400 transition">
                        ⏩ SKIP INNINGS
                    </button>
                </div>

                {/* Scorecard Tab */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button onClick={() => setActiveTab('team1')} className="flex-1 px-3 py-2 text-sm font-medium text-gray-400">🏏 {matchState.userTeam}</button>
                        <button onClick={() => setActiveTab('team2')} className={`flex-1 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'team2' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>🏏 {matchState.opponentTeam}</button>
                        <button onClick={() => setActiveTab('commentary')} className="flex-1 px-3 py-2 text-sm font-medium text-gray-400">📝 Commentary</button>
                    </div>
                    <div className="p-3">
                        {activeTab === 'team1' && (
                            <Scorecard 
                                teamName={matchState.userTeam}
                                battingStats={matchState.userBattingStats?.map((s: any) => ({ 
                                    name: s.player?.name || s.name, 
                                    runs: s.runs, 
                                    balls: s.balls, 
                                    fours: s.fours, 
                                    sixes: s.sixes, 
                                    dismissal: s.dismissal,
                                    strikeRate: s.strikeRate 
                                })) || []}
                                bowlingStats={userBowlingStats.map(s => ({ 
                                    name: s.player.name, 
                                    overs: s.overs + (s.ballsInCurrentOver / 6), 
                                    maidens: s.maidens, 
                                    runs: s.runs, 
                                    wickets: s.wickets, 
                                    economy: s.economy 
                                }))}
                                total={matchState.userScore}
                                wickets={matchState.userWickets}
                                overs={matchState.overs}
                            />
                        )}
                        {activeTab === 'team2' && (
                            <>
                                <Scorecard 
                                    teamName={matchState.opponentTeam}
                                    battingStats={battedPlayers.map(s => ({ 
                                        name: s.player.name, 
                                        runs: s.runs, 
                                        balls: s.balls, 
                                        fours: s.fours, 
                                        sixes: s.sixes, 
                                        dismissal: s.dismissal,
                                        strikeRate: s.strikeRate
                                    }))}
                                    bowlingStats={opponentBowlingStats.map(s => ({ 
                                        name: s.player.name, 
                                        overs: s.overs + (s.ballsInCurrentOver / 6), 
                                        maidens: s.maidens, 
                                        runs: s.runs, 
                                        wickets: s.wickets, 
                                        economy: s.economy 
                                    }))}
                                    total={currentScore}
                                    wickets={currentWickets}
                                    overs={ballsBowled / 6}
                                />
                                
                                {yetToBat.length > 0 && yetToBat.some(b => b.balls === 0 && b.runs === 0) && (
                                    <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-900/30 rounded">
                                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">⏳ Yet to Bat</div>
                                        <div className="flex flex-wrap gap-1">
                                            {yetToBat.filter(b => b.balls === 0 && b.runs === 0).map((batsman, idx) => (
                                                <span key={idx} className="text-[10px] px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                                                    {batsman.player.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                        {activeTab === 'commentary' && (
                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 h-64 overflow-y-auto">
                                <div className="text-xs text-gray-500 mb-2">📝 FULL COMMENTARY</div>
                                {commentary.map((text: string, idx: number) => (
                                    <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-800">{text}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};