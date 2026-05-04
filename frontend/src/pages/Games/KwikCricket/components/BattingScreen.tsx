// frontend/src/pages/Games/KwikCricket/components/BattingScreen.tsx
import React, { useState } from 'react';
import { getShotOutcome, ShotType } from '../logic/shotOutcomes';

interface BattingScreenProps {
    matchState: any;
    onUpdate: (updates: any) => void;
    onEndMatch: (result: string, userScore: number, userWickets: number, opponentScore: number, opponentWickets: number) => void;
    onAddOverCommentary: (over: number, text: string) => void;
}

export const BattingScreen: React.FC<BattingScreenProps> = ({ matchState, onUpdate, onEndMatch, onAddOverCommentary }) => {
    const [currentScore, setCurrentScore] = useState(matchState.userScore);
    const [currentWickets, setCurrentWickets] = useState(matchState.userWickets);
    const [currentOver, setCurrentOver] = useState(matchState.currentOver);
    const [currentBall, setCurrentBall] = useState(matchState.currentBall);
    const [commentary, setCommentary] = useState([...matchState.commentary]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAnimation, setShowAnimation] = useState<{ type: string; runs: number } | null>(null);
    const [selectedOver, setSelectedOver] = useState(1);
    const [overSummaries, setOverSummaries] = useState<{ over: number; runs: number; wickets: number; text: string }[]>([]);

    const totalBalls = matchState.overs * 6;
    const ballsPlayed = (currentOver - 1) * 6 + (currentBall - 1);
    const ballsRemaining = totalBalls - ballsPlayed;
    const runRate = ballsPlayed > 0 ? (currentScore / ballsPlayed) * 6 : 0;
    const projectedScore = ballsPlayed > 0 ? Math.floor((currentScore / ballsPlayed) * totalBalls) : 0;

    let overRuns = 0;
    let overWickets = 0;

    const handleShot = (shotType: ShotType) => {
        if (matchState.isGameOver || isProcessing || matchState.userInningsComplete) return;
        
        setIsProcessing(true);
        
        const result = getShotOutcome(shotType);
        
        // Show animation
        setShowAnimation({ type: result.animation, runs: result.runs });
        setTimeout(() => setShowAnimation(null), 800);
        
        let newScore = currentScore;
        let newWickets = currentWickets;
        let newCommentary = [...commentary];
        
        if (!result.isWicket) {
            newScore += result.runs;
            overRuns += result.runs;
            newCommentary.push(`Ball ${currentBall}: ${result.message} (+${result.runs})`);
        } else {
            newWickets += 1;
            overWickets += 1;
            newCommentary.push(`Ball ${currentBall}: ${result.message} WICKET!`);
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
        
        const isInningsComplete = newOver > matchState.overs || newWickets >= 10;
        
        if (isInningsComplete) {
            const finalScore = newScore;
            const finalWickets = newWickets;
            newCommentary.push(`🏏 INNINGS COMPLETE! ${matchState.userTeam}: ${finalScore}/${finalWickets}`);
            setCommentary(newCommentary);
            
            onUpdate({
                userScore: finalScore,
                userWickets: finalWickets,
                currentOver: newOver,
                currentBall: newBall,
                commentary: newCommentary,
                userInningsComplete: true
            });
            
            // After user innings, move to bowling
            setTimeout(() => {
                onUpdate({
                    opponentScore: 0,
                    opponentWickets: 0,
                    currentOver: 1,
                    currentBall: 1,
                    isInningsComplete: false,
                    userInningsComplete: true,
                    target: finalScore + 1,
                    commentary: [...newCommentary, `🎯 Target: ${finalScore + 1} runs to win`]
                });
                onEndMatch('', finalScore, finalWickets, 0, 0);
            }, 1000);
        } else {
            onUpdate({
                userScore: newScore,
                userWickets: newWickets,
                currentOver: newOver,
                currentBall: newBall,
                commentary: newCommentary
            });
        }
        
        setIsProcessing(false);
    };

    // Get animation class
    const getAnimationClass = () => {
        if (!showAnimation) return '';
        if (showAnimation.type === 'six') return 'animate-bounce text-yellow-400 text-4xl';
        if (showAnimation.type === 'boundary') return 'animate-pulse text-green-400 text-4xl';
        if (showAnimation.type === 'wicket') return 'animate-shake text-red-500 text-4xl';
        return 'animate-fade text-blue-400 text-2xl';
    };

    return (
        <div className="space-y-3">
            {/* Score Board */}
            <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-4xl font-bold text-white">
                    {currentScore}/{currentWickets}
                </div>
                <div className="text-gray-400 text-sm">
                    Overs: {currentOver}.{currentBall - 1} / {matchState.overs}
                </div>
                <div className="text-gray-400 text-xs">
                    Run Rate: {runRate.toFixed(2)} • Projected: {projectedScore}
                </div>
            </div>

            {/* Animation Display */}
            {showAnimation && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${getAnimationClass()}`}>
                    {showAnimation.type === 'six' && '💥 SIX! 💥'}
                    {showAnimation.type === 'boundary' && '🏏 FOUR! 🏏'}
                    {showAnimation.type === 'wicket' && '🎯 WICKET! 🎯'}
                    {showAnimation.type === 'single' && `${showAnimation.runs} run`}
                    {showAnimation.type === 'double' && `${showAnimation.runs} runs`}
                    {showAnimation.type === 'triple' && `${showAnimation.runs} runs`}
                    {showAnimation.type === 'dot' && '⚫ Dot Ball'}
                </div>
            )}

            {/* Team Comparison */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 font-bold text-xs">{matchState.userTeam}</div>
                    <div className="text-xl font-bold text-white">{currentScore}/{currentWickets}</div>
                    {!matchState.userInningsComplete && <div className="text-green-400 text-[10px]">● Batting</div>}
                </div>
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 font-bold text-xs">{matchState.opponentTeam}</div>
                    <div className="text-xl font-bold text-gray-400">Yet to bat</div>
                </div>
            </div>

            {/* Shot Selection */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={() => handleShot('aggressive')}
                    disabled={matchState.userInningsComplete || isProcessing}
                    className="py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition text-sm disabled:opacity-50"
                >
                    💥 AGGRESSIVE
                </button>
                <button
                    onClick={() => handleShot('normal')}
                    disabled={matchState.userInningsComplete || isProcessing}
                    className="py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition text-sm disabled:opacity-50"
                >
                    ⚖️ NORMAL
                </button>
                <button
                    onClick={() => handleShot('defensive')}
                    disabled={matchState.userInningsComplete || isProcessing}
                    className="py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition text-sm disabled:opacity-50"
                >
                    🛡️ DEFENSIVE
                </button>
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

            <div className="text-center text-[10px] text-gray-500">
                Balls remaining: {ballsRemaining}
            </div>
        </div>
    );
};