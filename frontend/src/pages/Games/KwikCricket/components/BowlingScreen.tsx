// frontend/src/pages/Games/KwikCricket/components/BowlingScreen.tsx
import React, { useState, useEffect } from 'react';
import { bowlBall } from '../logic/aiBowling';

interface BowlingScreenProps {
    matchState: any;
    onUpdate: (updates: any) => void;
    onEndMatch: (result: string, userScore: number, userWickets: number, opponentScore: number, opponentWickets: number) => void;
    onAddOverCommentary: (over: number, text: string) => void;
}

export const BowlingScreen: React.FC<BowlingScreenProps> = ({ matchState, onUpdate, onEndMatch, onAddOverCommentary }) => {
    const [target, setTarget] = useState(matchState.target);
    const [currentScore, setCurrentScore] = useState(matchState.opponentScore);
    const [currentWickets, setCurrentWickets] = useState(matchState.opponentWickets);
    const [currentOver, setCurrentOver] = useState(1);
    const [currentBall, setCurrentBall] = useState(1);
    const [commentary, setCommentary] = useState([...matchState.commentary]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAnimation, setShowAnimation] = useState<{ type: string; runs: number } | null>(null);
    const [selectedOver, setSelectedOver] = useState(1);
    const [overSummaries, setOverSummaries] = useState<{ over: number; runs: number; wickets: number; text: string }[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [canSkip, setCanSkip] = useState(true);

    let overRuns = 0;
    let overWickets = 0;

    useEffect(() => {
        setTarget(matchState.userScore + 1);
        setCommentary(prev => [...prev, `🎯 Target: ${matchState.userScore + 1} runs to win`]);
    }, []);

    const simulateBall = () => {
        if (isProcessing || matchState.isGameOver) return;
        
        setIsProcessing(true);
        
        const result = bowlBall(matchState.difficulty, currentOver, currentBall, matchState.overs);
        
        // Show animation
        setShowAnimation({ type: result.animation, runs: result.runs });
        setTimeout(() => setShowAnimation(null), 800);
        
        let newScore = currentScore;
        let newWickets = currentWickets;
        let newCommentary = [...commentary];
        
        if (!result.isWicket) {
            newScore += result.runs;
            overRuns += result.runs;
            newCommentary.push(`${currentOver}.${currentBall}: ${result.message} (+${result.runs})`);
        } else {
            newWickets += 1;
            overWickets += 1;
            newCommentary.push(`${currentOver}.${currentBall}: ${result.message} WICKET!`);
        }
        
        let newBall = currentBall + 1;
        let newOver = currentOver;
        
        if (newBall > 6) {
            const overText = `Over ${currentOver}: ${overRuns}/${overWickets} | Total: ${newScore}/${newWickets}`;
            onAddOverCommentary(currentOver, overText);
            setOverSummaries(prev => [...prev, { over: currentOver, runs: overRuns, wickets: overWickets, text: overText }]);
            newCommentary.push(`📊 ${overText}`);
            newBall = 1;
            newOver += 1;
            overRuns = 0;
            overWickets = 0;
        }
        
        setCurrentScore(newScore);
        setCurrentWickets(newWickets);
        setCurrentOver(newOver);
        setCurrentBall(newBall);
        setCommentary(newCommentary);
        
        const isTargetReached = newScore >= target;
        const isInningsComplete = newOver > matchState.overs;
        const isAllOut = newWickets >= 10;
        
        if (isTargetReached || isInningsComplete || isAllOut) {
            const won = newScore < target;
            newCommentary.push(won 
                ? `🏆 ${matchState.userTeam} wins by ${target - newScore} runs!` 
                : `${matchState.opponentTeam} wins!`);
            setCommentary(newCommentary);
            
            onUpdate({ isGameOver: true, result: won ? 'win' : 'loss' });
            onEndMatch(won ? 'win' : 'loss', matchState.userScore, matchState.userWickets, newScore, newWickets);
        } else {
            onUpdate({
                opponentScore: newScore,
                opponentWickets: newWickets,
                commentary: newCommentary
            });
        }
        
        setIsProcessing(false);
    };
    
    const skipBowling = () => {
        if (!canSkip || isSimulating) return;
        setCanSkip(false);
        setIsSimulating(true);
        setIsProcessing(true);
        
        let simScore = 0;
        let simWickets = 0;
        let simCommentary = [...commentary, "⚡ AUTO-BOWLING SIMULATION..."];
        let simOverSummaries = [...overSummaries];
        let simOverRuns = 0;
        let simOverWickets = 0;
        
        for (let over = 1; over <= matchState.overs; over++) {
            simOverRuns = 0;
            simOverWickets = 0;
            for (let ball = 1; ball <= 6; ball++) {
                const result = bowlBall(matchState.difficulty, over, ball, matchState.overs);
                if (!result.isWicket) {
                    simScore += result.runs;
                    simOverRuns += result.runs;
                } else {
                    simWickets += 1;
                    simOverWickets += 1;
                }
                if (simScore >= target || simWickets >= 10) break;
            }
            const overText = `Over ${over}: ${simOverRuns}/${simOverWickets} | Total: ${simScore}/${simWickets}`;
            onAddOverCommentary(over, overText);
            simOverSummaries.push({ over, runs: simOverRuns, wickets: simOverWickets, text: overText });
            simCommentary.push(`📊 ${overText}`);
            if (simScore >= target || simWickets >= 10) break;
        }
        
        const won = simScore < target;
        simCommentary.push(won 
            ? `🏆 ${matchState.userTeam} wins by ${target - simScore} runs!` 
            : `${matchState.opponentTeam} wins!`);
        
        setOverSummaries(simOverSummaries);
        setCommentary(simCommentary);
        setCurrentScore(simScore);
        setCurrentWickets(simWickets);
        
        onUpdate({
            opponentScore: simScore,
            opponentWickets: simWickets,
            commentary: simCommentary,
            isGameOver: true,
            result: won ? 'win' : 'loss'
        });
        onEndMatch(won ? 'win' : 'loss', matchState.userScore, matchState.userWickets, simScore, simWickets);
        setIsProcessing(false);
        setIsSimulating(false);
    };

    const getAnimationClass = () => {
        if (!showAnimation) return '';
        if (showAnimation.type === 'six') return 'animate-bounce text-yellow-400 text-4xl';
        if (showAnimation.type === 'boundary') return 'animate-pulse text-green-400 text-4xl';
        if (showAnimation.type === 'wicket') return 'animate-shake text-red-500 text-4xl';
        return 'animate-fade text-blue-400 text-2xl';
    };

    const totalBalls = matchState.overs * 6;
    const ballsPlayed = (currentOver - 1) * 6 + (currentBall - 1);
    const runsNeeded = target - currentScore;
    const ballsRemaining = totalBalls - ballsPlayed;
    const requiredRunRate = ballsRemaining > 0 ? (runsNeeded / (ballsRemaining / 6)).toFixed(2) : '0.00';

    return (
        <div className="space-y-3">
            {/* Score Board */}
            <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-4xl font-bold text-white">
                    {currentScore}/{currentWickets}
                </div>
                <div className="text-gray-400 text-sm">
                    Need {Math.max(0, runsNeeded)} runs in {ballsRemaining} balls
                </div>
                <div className="text-gray-400 text-xs">
                    Required RR: {requiredRunRate}
                </div>
            </div>

            {/* Animation Display */}
            {showAnimation && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${getAnimationClass()}`}>
                    {showAnimation.type === 'six' && '💥 SIX! 💥'}
                    {showAnimation.type === 'boundary' && '🏏 FOUR! 🏏'}
                    {showAnimation.type === 'wicket' && '🎯 WICKET! 🎯'}
                </div>
            )}

            {/* Team Comparison */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 font-bold text-xs">{matchState.userTeam}</div>
                    <div className="text-lg font-bold text-white">{matchState.userScore}/{matchState.userWickets}</div>
                </div>
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 font-bold text-xs">{matchState.opponentTeam}</div>
                    <div className="text-xl font-bold text-white">{currentScore}/{currentWickets}</div>
                    <div className="text-green-400 text-[10px]">● Batting</div>
                </div>
            </div>

            {/* Bowling Controls */}
            <div className="space-y-2">
                <button
                    onClick={simulateBall}
                    disabled={isProcessing || matchState.isGameOver}
                    className="w-full py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-500 transition text-sm disabled:opacity-50"
                >
                    🎯 BOWL BALL {currentOver}.{currentBall}
                </button>
                
                {canSkip && !matchState.isGameOver && (
                    <button
                        onClick={skipBowling}
                        className="w-full py-1.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-500 transition"
                    >
                        ⏩ Skip Innings (Auto-simulate)
                    </button>
                )}
            </div>

            {/* Over Selector Tabs */}
            <div className="flex gap-1 overflow-x-auto pb-1">
                {Array.from({ length: matchState.overs }, (_, i) => i + 1).map(over => {
                    const summary = overSummaries.find(s => s.over === over);
                    return (
                        <button
                            key={over}
                            onClick={() => setSelectedOver(over)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold whitespace-nowrap ${
                                selectedOver === over
                                    ? 'bg-yellow-500 text-black'
                                    : 'bg-gray-700 text-gray-300'
                            }`}
                        >
                            Over {over}
                            {summary && ` (${summary.runs}/${summary.wickets})`}
                        </button>
                    );
                })}
            </div>

            {/* Over Commentary */}
            <div className="bg-gray-900 rounded-lg p-2">
                <div className="text-gray-400 text-[10px] mb-1">📝 Over Commentary</div>
                <div className="space-y-0.5 max-h-24 overflow-y-auto">
                    {overSummaries
                        .filter(s => s.over === selectedOver)
                        .map((s, idx) => (
                            <div key={idx} className="text-white text-xs">
                                {s.text}
                            </div>
                        ))}
                    {overSummaries.filter(s => s.over === selectedOver).length === 0 && (
                        <div className="text-gray-500 text-xs">No commentary yet</div>
                    )}
                </div>
            </div>

            {/* Ball-by-ball Commentary */}
            <div className="bg-gray-800 rounded-lg p-2 h-24 overflow-y-auto">
                <div className="text-gray-400 text-[10px] mb-1">📝 Ball-by-Ball</div>
                {commentary.slice(-6).map((text: string, idx: number) => (
                    <div key={idx} className="text-white text-xs py-0.5">{text}</div>
                ))}
            </div>
        </div>
    );
};