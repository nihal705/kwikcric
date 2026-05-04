// frontend/src/pages/Games/KwikCricket/components/TwoPlayerMode.tsx
import React, { useState } from 'react';
import { getShotOutcome } from '../logic/shotOutcomes';

interface TwoPlayerModeProps {
    matchState: any;
    onUpdate: (updates: any) => void;
    onEndMatch: (result: string, userScore: number, userWickets: number, opponentScore: number, opponentWickets: number) => void;
    onAddOverCommentary: (over: number, text: string) => void;
}

export const TwoPlayerMode: React.FC<TwoPlayerModeProps> = ({ matchState, onUpdate, onEndMatch, onAddOverCommentary }) => {
    const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
    const [player1Score, setPlayer1Score] = useState(0);
    const [player1Wickets, setPlayer1Wickets] = useState(0);
    const [player2Score, setPlayer2Score] = useState(0);
    const [player2Wickets, setPlayer2Wickets] = useState(0);
    const [currentOver, setCurrentOver] = useState(1);
    const [currentBall, setCurrentBall] = useState(1);
    const [commentary, setCommentary] = useState<string[]>(['👥 Two Player Mode!', `Player 1 (${matchState.userTeam}) to bat first`]);
    const [isPlayer1Done, setIsPlayer1Done] = useState(false);
    const [target, setTarget] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showAnimation, setShowAnimation] = useState<{ type: string; runs: number } | null>(null);
    const [selectedOver, setSelectedOver] = useState(1);
    const [overSummaries, setOverSummaries] = useState<{ over: number; runs: number; wickets: number; text: string }[]>([]);

    let overRuns = 0;
    let overWickets = 0;
    const ballsPlayed = (currentOver - 1) * 6 + (currentBall - 1);

    const handleShot = (shotType: 'aggressive' | 'normal' | 'defensive') => {
        if (isGameOver || isProcessing) return;
        
        setIsProcessing(true);
        
        const result = getShotOutcome(shotType);
        
        // Show animation
        setShowAnimation({ type: result.animation, runs: result.runs });
        setTimeout(() => setShowAnimation(null), 800);
        
        let newCommentary = [...commentary];
        
        if (currentPlayer === 'player1' && !isPlayer1Done) {
            let newScore = player1Score;
            let newWickets = player1Wickets;
            
            if (!result.isWicket) {
                newScore += result.runs;
                overRuns += result.runs;
            } else {
                newWickets += 1;
                overWickets += 1;
            }
            
            setPlayer1Score(newScore);
            setPlayer1Wickets(newWickets);
            newCommentary.push(`${currentOver}.${currentBall}: ${result.message} (Player 1)`);
            
            let newBall = currentBall + 1;
            let newOver = currentOver;
            if (newBall > 6) {
                const overText = `Over ${currentOver}: ${overRuns}/${overWickets} | Player 1: ${newScore}/${newWickets}`;
                onAddOverCommentary(currentOver, overText);
                setOverSummaries(prev => [...prev, { over: currentOver, runs: overRuns, wickets: overWickets, text: overText }]);
                newCommentary.push(`📊 ${overText}`);
                newBall = 1;
                newOver += 1;
                overRuns = 0;
                overWickets = 0;
            }
            
            const isInningsComplete = (newOver > matchState.overs) || (newWickets >= 10);
            
            if (isInningsComplete) {
                setIsPlayer1Done(true);
                setCurrentPlayer('player2');
                setTarget(newScore + 1);
                setCurrentOver(1);
                setCurrentBall(1);
                newCommentary.push(`🏏 Player 1 final score: ${newScore}/${newWickets}`);
                newCommentary.push(`🎯 Player 2 needs ${newScore + 1} runs to win!`);
                setCommentary(newCommentary);
                setOverSummaries([]);
                
                onUpdate({
                    userScore: newScore,
                    userWickets: newWickets,
                    target: newScore + 1,
                    commentary: newCommentary
                });
            } else {
                setCurrentOver(newOver);
                setCurrentBall(newBall);
                setCommentary(newCommentary);
            }
        } 
        else if (currentPlayer === 'player2') {
            let newScore = player2Score;
            let newWickets = player2Wickets;
            
            if (!result.isWicket) {
                newScore += result.runs;
                overRuns += result.runs;
            } else {
                newWickets += 1;
                overWickets += 1;
            }
            
            setPlayer2Score(newScore);
            setPlayer2Wickets(newWickets);
            newCommentary.push(`${currentOver}.${currentBall}: ${result.message} (Player 2)`);
            
            if (newScore >= target) {
                setIsGameOver(true);
                newCommentary.push(`🏆 Player 2 wins by ${10 - newWickets} wickets!`);
                setCommentary(newCommentary);
                onEndMatch('loss', player1Score, player1Wickets, newScore, newWickets);
                setIsProcessing(false);
                return;
            }
            
            let newBall = currentBall + 1;
            let newOver = currentOver;
            if (newBall > 6) {
                const overText = `Over ${currentOver}: ${overRuns}/${overWickets} | Player 2: ${newScore}/${newWickets}`;
                onAddOverCommentary(currentOver, overText);
                setOverSummaries(prev => [...prev, { over: currentOver, runs: overRuns, wickets: overWickets, text: overText }]);
                newCommentary.push(`📊 ${overText}`);
                newBall = 1;
                newOver += 1;
                overRuns = 0;
                overWickets = 0;
            }
            
            const isInningsComplete = (newOver > matchState.overs) || (newWickets >= 10);
            
            if (isInningsComplete) {
                setIsGameOver(true);
                const won = newScore < target;
                newCommentary.push(won 
                    ? `🏆 Player 1 wins by ${target - newScore - 1} runs!` 
                    : `🏆 Player 2 wins!`);
                setCommentary(newCommentary);
                onEndMatch(won ? 'win' : 'loss', player1Score, player1Wickets, newScore, newWickets);
                setIsProcessing(false);
                return;
            }
            
            setCurrentOver(newOver);
            setCurrentBall(newBall);
            setCommentary(newCommentary);
        }
        
        setIsProcessing(false);
    };

    const getAnimationClass = () => {
        if (!showAnimation) return '';
        if (showAnimation.type === 'six') return 'animate-bounce text-yellow-400 text-4xl';
        if (showAnimation.type === 'boundary') return 'animate-pulse text-green-400 text-4xl';
        if (showAnimation.type === 'wicket') return 'animate-shake text-red-500 text-4xl';
        return 'animate-fade text-blue-400 text-2xl';
    };

    const currentRunRate = currentPlayer === 'player1' && !isPlayer1Done
        ? (ballsPlayed > 0 ? (player1Score / ballsPlayed) * 6 : 0)
        : (ballsPlayed > 0 ? (player2Score / ballsPlayed) * 6 : 0);

    return (
        <div className="space-y-3">
            {/* Animation Display */}
            {showAnimation && (
                <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 ${getAnimationClass()}`}>
                    {showAnimation.type === 'six' && '💥 SIX! 💥'}
                    {showAnimation.type === 'boundary' && '🏏 FOUR! 🏏'}
                    {showAnimation.type === 'wicket' && '🎯 WICKET! 🎯'}
                </div>
            )}

            {/* Current Player Indicator */}
            <div className="text-center">
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    currentPlayer === 'player1' && !isPlayer1Done 
                        ? 'bg-yellow-500 text-black' 
                        : isPlayer1Done ? 'bg-green-500 text-white' : 'bg-gray-600 text-white'
                }`}>
                    {currentPlayer === 'player1' && !isPlayer1Done 
                        ? '🎮 PLAYER 1 - BATTING' 
                        : isPlayer1Done ? '🎮 PLAYER 2 - BATTING' : '🎮 PLAYER 2 - BATTING'}
                </div>
            </div>

            {/* Score Board */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 font-bold text-xs">Player 1</div>
                    <div className="text-xl font-bold text-white">{player1Score}/{player1Wickets}</div>
                    <div className="text-[10px] text-gray-400">{matchState.userTeam}</div>
                    {!isPlayer1Done && currentPlayer === 'player1' && (
                        <div className="text-green-400 text-[9px] mt-0.5">● Batting now</div>
                    )}
                </div>
                <div className="bg-gray-700 rounded-lg p-2 text-center">
                    <div className="text-yellow-400 font-bold text-xs">Player 2</div>
                    <div className="text-xl font-bold text-white">{player2Score}/{player2Wickets}</div>
                    <div className="text-[10px] text-gray-400">{matchState.opponentTeam}</div>
                    {isPlayer1Done && currentPlayer === 'player2' && (
                        <div className="text-green-400 text-[9px] mt-0.5">● Batting now</div>
                    )}
                </div>
            </div>

            {/* Target Info */}
            {isPlayer1Done && (
                <div className="text-center text-yellow-400 font-bold text-sm">
                    Target: {target} runs
                </div>
            )}

            {/* Overs Info */}
            <div className="text-center text-gray-400 text-xs">
                Over: {currentOver}.{currentBall - 1} / {matchState.overs} • Run Rate: {currentRunRate.toFixed(2)}
            </div>

            {/* Shot Selection */}
            <div className="grid grid-cols-3 gap-2">
                <button
                    onClick={() => handleShot('aggressive')}
                    disabled={isGameOver || isProcessing}
                    className="py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition text-sm disabled:opacity-50"
                >
                    💥 AGGRESSIVE
                </button>
                <button
                    onClick={() => handleShot('normal')}
                    disabled={isGameOver || isProcessing}
                    className="py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition text-sm disabled:opacity-50"
                >
                    ⚖️ NORMAL
                </button>
                <button
                    onClick={() => handleShot('defensive')}
                    disabled={isGameOver || isProcessing}
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
        </div>
    );
};