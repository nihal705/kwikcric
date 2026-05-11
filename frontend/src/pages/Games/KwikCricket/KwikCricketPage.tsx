// frontend/src/pages/Games/KwikCricket/KwikCricketPage.tsx
import React, { useState, useEffect } from 'react';
import { MatchSetup } from './components/MatchSetup';
import { SquadSelection } from './components/SquadSelection';
import { GamePlay } from './components/GamePlay';
import { KwikPlay } from './components/KwikPlay';
import { Scorecard } from './components/Scorecard';
import { Player, getBalancedSquad, getRandomOpponentSquad } from './data/playersData';
import { saveMatch } from '../../../services/kwikCricketAPI';
import { useAuth } from '../../../contexts/AuthContext';
import { saveGameState, loadGameState, clearGameState, getUserStats, saveMatchAuth } from '../../../services/authAPI';

// Guest storage keys
const GUEST_STATS_KEY = 'kwik_cricket_guest_stats';
const GUEST_HISTORY_KEY = 'kwik_cricket_guest_history';

type GameMode = 'setup' | 'squad' | 'playing' | 'kwikplay' | 'result';

interface MatchState {
    gameType: 'full' | 'kwikplay';
    overs: number;
    userTeam: string;
    opponentTeam: string;
    difficulty: 'easy' | 'medium' | 'hard';
    isBowlingFirst: boolean;
    userScore: number;
    userWickets: number;
    opponentScore: number;
    opponentWickets: number;
    target: number;
    currentInnings: 'user' | 'opponent';
    ballsBowled: number;
    commentary: string[];
    isGameOver: boolean;
    result: string;
    sessionId: string;
    winner: string;
    margin: string;
    userBattingStats: any[];
    userBowlingStats: any[];
    opponentBattingStats: any[];
    opponentBowlingStats: any[];
    userInningsComplete: boolean;
}

const KwikCricketPage: React.FC = () => {
    const [gameMode, setGameMode] = useState<GameMode>('setup');
    const [activeTab, setActiveTab] = useState<'team1' | 'team2' | 'commentary'>('team1');
    const [selectedUserTeam, setSelectedUserTeam] = useState('');
    const [selectedOpponentTeam, setSelectedOpponentTeam] = useState('');
    const [userSquad, setUserSquad] = useState<Player[]>([]);
    const [opponentSquad, setOpponentSquad] = useState<Player[]>([]);
    const [battingOrder, setBattingOrder] = useState<Player[]>([]);
    const [lastMatchSettings, setLastMatchSettings] = useState<any>(null);
    const { isAuthenticated } = useAuth();
    const [matchState, setMatchState] = useState<MatchState>({
        gameType: 'full',
        overs: 2,
        userTeam: 'India',
        opponentTeam: 'Australia',
        difficulty: 'medium',
        isBowlingFirst: false,
        userScore: 0,
        userWickets: 0,
        opponentScore: 0,
        opponentWickets: 0,
        target: 0,
        currentInnings: 'user',
        ballsBowled: 0,
        commentary: [],
        isGameOver: false,
        result: '',
        sessionId: localStorage.getItem('kwikCricketSessionId') || '',
        winner: '',
        margin: '',
        userBattingStats: [],
        userBowlingStats: [],
        opponentBattingStats: [],
        opponentBowlingStats: [],
        userInningsComplete: false,
    });
    const [stats, setStats] = useState<any>(null);

    // Auto-save game state on every update
    useEffect(() => {
        if (gameMode === 'playing' && !matchState.isGameOver && isAuthenticated) {
            const saveTimeout = setTimeout(() => {
                saveGameState({
                    gameMode,
                    matchState,
                    userSquad,
                    opponentSquad,
                    battingOrder,
                    lastMatchSettings,
                    timestamp: Date.now()
                });
            }, 1000);
            
            return () => clearTimeout(saveTimeout);
        }
    }, [matchState, gameMode, isAuthenticated, userSquad, opponentSquad, battingOrder, lastMatchSettings]);

    // Load saved game on mount
    useEffect(() => {
        const loadSaved = async () => {
            if (isAuthenticated) {
                const saved = await loadGameState();
                if (saved.data && !matchState.isGameOver) {
                    const parsed = typeof saved.data === 'string' ? JSON.parse(saved.data) : saved.data;
                    if (parsed.gameMode === 'playing') {
                        setMatchState(parsed.matchState);
                        setUserSquad(parsed.userSquad || []);
                        setOpponentSquad(parsed.opponentSquad || []);
                        setBattingOrder(parsed.battingOrder || []);
                        setLastMatchSettings(parsed.lastMatchSettings);
                        setGameMode(parsed.gameMode);
                    }
                }
            }
            loadStats();
        };
        loadSaved();
    }, [isAuthenticated]);

    const loadStats = async () => {
        if (isAuthenticated) {
            const response = await getUserStats();
            if (response.data) {
                setStats(response.data);
            }
        } else {
            // Load guest stats from localStorage
            const guestStats = localStorage.getItem(GUEST_STATS_KEY);
            if (guestStats) {
                setStats(JSON.parse(guestStats));
            }
        }
    };

    const handleProceedToSquad = (userTeam: string, opponentTeam: string) => {
        setSelectedUserTeam(userTeam);
        setSelectedOpponentTeam(opponentTeam);
        setGameMode('squad');
    };

    const handleSquadConfirm = (userSquadData: Player[], opponentSquadData: Player[], battingOrderData: Player[]) => {
        setUserSquad(userSquadData);
        setOpponentSquad(opponentSquadData);
        setBattingOrder(battingOrderData);
        setGameMode('setup');
    };

    const startMatch = (settings: any) => {
        setLastMatchSettings(settings);
        
        if (settings.gameType === 'kwikplay') {
            setGameMode('kwikplay');
            return;
        }
        
        // Full match - use getBalancedSquad with the team name (works for both intl and IPL)
        if (userSquad.length === 0) {
            const balancedSquad = getBalancedSquad(settings.userTeam);
            const randomOpponent = getRandomOpponentSquad(settings.opponentTeam);
            setUserSquad(balancedSquad);
            setOpponentSquad(randomOpponent);
            setBattingOrder([...balancedSquad]);
        }
        
        const isUserBattingFirst = settings.batFirst === 'bat';
        
        setMatchState({
            ...matchState,
            gameType: 'full',
            overs: settings.overs,
            userTeam: settings.userTeam,
            opponentTeam: settings.opponentTeam,
            difficulty: settings.difficulty,
            isBowlingFirst: !isUserBattingFirst,
            userScore: 0,
            userWickets: 0,
            opponentScore: 0,
            opponentWickets: 0,
            target: 0,
            currentInnings: isUserBattingFirst ? 'user' : 'opponent',
            ballsBowled: 0,
            commentary: [`🏏 ${settings.userTeam} vs ${settings.opponentTeam}`, `${settings.overs} overs match`, isUserBattingFirst ? `${settings.userTeam} to bat first` : `${settings.opponentTeam} to bat first`],
            isGameOver: false,
            result: '',
            winner: '',
            margin: '',
            userBattingStats: [],
            userBowlingStats: [],
            opponentBattingStats: [],
            opponentBowlingStats: [],
            userInningsComplete: false,
        });
        
        setGameMode('playing');
    };

    const updateMatchState = (updates: Partial<MatchState>) => {
        setMatchState(prev => ({ ...prev, ...updates }));
    };

    const saveMatchToDB = async (matchData: any) => {
        if (isAuthenticated) {
            await saveMatchAuth(matchData);
        } else {
            // Save to localStorage for guest
            const existingStats = localStorage.getItem(GUEST_STATS_KEY);
            const existingHistory = localStorage.getItem(GUEST_HISTORY_KEY);
            let stats = existingStats ? JSON.parse(existingStats) : { matches_played: 0, matches_won: 0, total_runs: 0, total_wickets: 0, highest_score: 0 };
            let history = existingHistory ? JSON.parse(existingHistory) : [];
            
            // Update stats
            stats.matches_played += 1;
            if (matchData.result === 'win') stats.matches_won += 1;
            stats.total_runs += matchData.userScore;
            stats.total_wickets += matchData.userWickets;
            stats.highest_score = Math.max(stats.highest_score, matchData.userScore);
            
            // Add to history
            history.unshift({
                ...matchData,
                played_at: new Date().toISOString()
            });
            
            localStorage.setItem(GUEST_STATS_KEY, JSON.stringify(stats));
            localStorage.setItem(GUEST_HISTORY_KEY, JSON.stringify(history.slice(0, 20)));
            setStats(stats);
        }
    };

    const endMatch = async (
        result: string, 
        winner: string, 
        margin: string, 
        finalUserScore: number, 
        finalUserWickets: number, 
        finalOpponentScore: number, 
        finalOpponentWickets: number,
        userBattingStats: any[],
        userBowlingStats: any[],  
        opponentBattingStats: any[],
        opponentBowlingStats: any[]    
    ) => {
        const sessionId = matchState.sessionId || localStorage.getItem('kwikCricketSessionId') || '';
        
        try {
            await saveMatch({
                sessionId: sessionId || undefined,
                userTeam: matchState.userTeam,
                opponentTeam: matchState.opponentTeam,
                overs: matchState.overs,
                userScore: finalUserScore,
                userWickets: finalUserWickets,
                opponentScore: finalOpponentScore,
                opponentWickets: finalOpponentWickets,
                result: result === 'win' ? 'win' : 'loss'
            });
            
            // Also save to authenticated storage if logged in
            if (isAuthenticated) {
                await saveMatchAuth({
                    userTeam: matchState.userTeam,
                    opponentTeam: matchState.opponentTeam,
                    overs: matchState.overs,
                    userScore: finalUserScore,
                    userWickets: finalUserWickets,
                    opponentScore: finalOpponentScore,
                    opponentWickets: finalOpponentWickets,
                    result: result === 'win' ? 'win' : 'loss'
                });
            } else {
                saveMatchToDB({
                    userTeam: matchState.userTeam,
                    opponentTeam: matchState.opponentTeam,
                    overs: matchState.overs,
                    userScore: finalUserScore,
                    userWickets: finalUserWickets,
                    opponentScore: finalOpponentScore,
                    opponentWickets: finalOpponentWickets,
                    result: result === 'win' ? 'win' : 'loss'
                });
            }
        } catch (error) {
            console.error('Failed to save match:', error);
        }
        
        setMatchState(prev => ({ 
            ...prev, 
            result, 
            winner, 
            margin, 
            isGameOver: true,
            userScore: finalUserScore,
            userWickets: finalUserWickets,
            opponentScore: finalOpponentScore,
            opponentWickets: finalOpponentWickets,
            userBattingStats: userBattingStats,
            userBowlingStats: userBowlingStats,
            opponentBattingStats: opponentBattingStats,
            opponentBowlingStats: opponentBowlingStats
        }));
        setGameMode('result');
        loadStats();
        
        // Clear saved game after match ends
        if (isAuthenticated) {
            await clearGameState();
        }
    };

    const endKwikPlay = (score: number, wickets: number) => {
        // Update matchState with Kwik Play results for display
        setMatchState(prev => ({
            ...prev,
            gameType: 'kwikplay',
            userScore: score,
            userWickets: wickets,
            isGameOver: true,
        }));
        setGameMode('result');
    };

    const resetGame = () => {
        if (lastMatchSettings) {
            startMatch(lastMatchSettings);
        } else {
            setGameMode('setup');
        }
        setActiveTab('team1');
    };

    const newMatch = () => {
        setGameMode('setup');
        setLastMatchSettings(null);
        setUserSquad([]);
        setOpponentSquad([]);
        setBattingOrder([]);
    };

    const exitKwikPlay = () => {
        setGameMode('setup');
    };

    const hasSquadSelected = userSquad.length === 11 && opponentSquad.length === 11;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-4">
            <div className="max-w-6xl mx-auto px-4">
                {gameMode === 'setup' && (
                    <MatchSetup 
                        onStart={startMatch} 
                        onProceedToSquad={handleProceedToSquad}
                        hasSquadSelected={hasSquadSelected}
                        stats={stats} 
                    />
                )}
                
                {gameMode === 'squad' && (
                    <SquadSelection
                        teamName={selectedUserTeam}
                        opponentTeamName={selectedOpponentTeam}
                        onConfirm={handleSquadConfirm}
                        onBack={() => setGameMode('setup')}
                    />
                )}
                
                {gameMode === 'kwikplay' && (
                    <KwikPlay
                        overs={lastMatchSettings?.kwikPlayOvers || 1}
                        userTeam={lastMatchSettings?.userTeam || 'India'}
                        onEndMatch={endKwikPlay}
                        onExit={exitKwikPlay}
                    />
                )}
                
                {gameMode === 'playing' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Left Column - Gameplay */}
                        <div>
                            <GamePlay
                                matchState={matchState}
                                userSquad={userSquad}
                                opponentSquad={opponentSquad}
                                battingOrder={battingOrder}
                                onUpdate={updateMatchState}
                                onEndMatch={endMatch}
                            />
                        </div>
                        
                        {/* Right Column - Scorecard */}
                        <div className="space-y-4">
                            {/* Current Innings Scorecard */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                                    <div className="font-semibold text-sm text-gray-800 dark:text-white">
                                        {matchState.currentInnings === 'user' ? matchState.userTeam : matchState.opponentTeam} - Current Innings
                                    </div>
                                </div>
                                <div className="p-3">
                                    <Scorecard 
                                        teamName={matchState.currentInnings === 'user' ? matchState.userTeam : matchState.opponentTeam}
                                        battingStats={matchState.currentInnings === 'user' 
                                            ? (matchState.userBattingStats?.map((s: any) => ({ name: s.player?.name || s.name, runs: s.runs, balls: s.balls, fours: s.fours, sixes: s.sixes, dismissal: s.dismissal, strikeRate: s.strikeRate })) || [])
                                            : (matchState.opponentBattingStats?.map((s: any) => ({ name: s.player?.name || s.name, runs: s.runs, balls: s.balls, fours: s.fours, sixes: s.sixes, dismissal: s.dismissal, strikeRate: s.strikeRate })) || [])
                                        }
                                        bowlingStats={matchState.currentInnings === 'user'
                                            ? (matchState.opponentBowlingStats?.map((s: any) => ({ name: s.player?.name || s.name, overs: s.overs, maidens: s.maidens, runs: s.runs, wickets: s.wickets, economy: s.economy })) || [])
                                            : (matchState.userBowlingStats?.map((s: any) => ({ name: s.player?.name || s.name, overs: s.overs, maidens: s.maidens, runs: s.runs, wickets: s.wickets, economy: s.economy })) || [])
                                        }
                                        total={matchState.currentInnings === 'user' ? matchState.userScore : matchState.opponentScore}
                                        wickets={matchState.currentInnings === 'user' ? matchState.userWickets : matchState.opponentWickets}
                                        overs={matchState.ballsBowled / 6}
                                    />
                                </div>
                            </div>
                            
                            {/* Live Commentary */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2">
                                    <div className="font-semibold text-sm text-gray-800 dark:text-white">📝 Live Commentary</div>
                                </div>
                                <div className="p-3 h-48 overflow-y-auto">
                                    {matchState.commentary.slice(-10).map((text: string, idx: number) => (
                                        <div key={idx} className="text-sm text-gray-700 dark:text-gray-300 py-1 border-b border-gray-100 dark:border-gray-800">
                                            {text}
                                        </div>
                                    ))}
                                    {matchState.commentary.length === 0 && (
                                        <div className="text-sm text-gray-500 text-center py-4">
                                            Waiting for first ball...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {gameMode === 'result' && (
                    <div className="space-y-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className={`px-4 py-3 text-center ${
                                matchState.gameType === 'kwikplay'
                                    ? 'bg-gradient-to-r from-orange-600 to-red-600'
                                    : matchState.result === 'win' 
                                        ? 'bg-gradient-to-r from-green-600 to-green-700' 
                                        : 'bg-gradient-to-r from-red-600 to-red-700'
                            }`}>
                                <div className="text-xl font-bold text-white">
                                    {matchState.gameType === 'kwikplay' 
                                        ? '⚡ KWIK PLAY COMPLETE!' 
                                        : (matchState.result === 'win' ? '🏆 VICTORY! 🏆' : '😔 DEFEAT 😔')}
                                </div>
                            </div>
                            
                            <div className="p-4 text-center">
                                {matchState.gameType === 'kwikplay' ? (
                                    <>
                                        <div className="text-5xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                            {matchState.userScore}/{matchState.userWickets}
                                        </div>
                                        <div className="text-sm text-gray-500 mb-4">
                                            {lastMatchSettings?.kwikPlayOvers || 1} over(s) challenge
                                        </div>
                                        {matchState.userScore >= 20 ? (
                                            <div className="text-green-600 font-semibold">🔥 OUTSTANDING! 🔥</div>
                                        ) : matchState.userScore >= 15 ? (
                                            <div className="text-blue-600 font-semibold">⭐ EXCELLENT! ⭐</div>
                                        ) : matchState.userScore >= 10 ? (
                                            <div className="text-yellow-600 font-semibold">👍 GOOD EFFORT! 👍</div>
                                        ) : matchState.userScore >= 5 ? (
                                            <div className="text-orange-600 font-semibold">📈 NEEDS IMPROVEMENT</div>
                                        ) : (
                                            <div className="text-gray-500 font-semibold">💪 KEEP PRACTICING!</div>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="text-base font-semibold text-green-600 dark:text-green-400 mb-3">
                                            {matchState.winner} won by {matchState.margin}
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                                            <div className="text-center">
                                                <div className="text-xs font-semibold text-gray-500">{matchState.userTeam}</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{matchState.userScore}/{matchState.userWickets}</div>
                                                <div className="text-[10px] text-gray-400">{matchState.overs} overs</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-semibold text-gray-500">{matchState.opponentTeam}</div>
                                                <div className="text-2xl font-bold text-gray-900 dark:text-white">{matchState.opponentScore}/{matchState.opponentWickets}</div>
                                                <div className="text-[10px] text-gray-400">{matchState.overs} overs</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                                
                                <div className="flex gap-3 justify-center mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <button onClick={resetGame} className="px-5 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition">
                                        Play Again
                                    </button>
                                    <button onClick={newMatch} className="px-5 py-1.5 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-400 transition">
                                        New Match
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Full Scorecards - Only for Full Match */}
                        {matchState.gameType !== 'kwikplay' && (
                            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="flex border-b border-gray-200 dark:border-gray-700">
                                    <button onClick={() => setActiveTab('team1')} className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'team1' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>🏏 {matchState.userTeam}</button>
                                    <button onClick={() => setActiveTab('team2')} className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${activeTab === 'team2' ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>🏏 {matchState.opponentTeam}</button>
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
                                            bowlingStats={matchState.userBowlingStats?.map((s: any) => ({ 
                                                name: s.player?.name || s.name, 
                                                overs: s.overs + (s.ballsInCurrentOver / 6), 
                                                maidens: s.maidens, 
                                                runs: s.runs, 
                                                wickets: s.wickets, 
                                                economy: s.economy 
                                            })) || []}
                                            total={matchState.userScore}
                                            wickets={matchState.userWickets}
                                            overs={matchState.overs}
                                        />
                                    )}
                                    {activeTab === 'team2' && (
                                        <Scorecard 
                                            teamName={matchState.opponentTeam}
                                            battingStats={matchState.opponentBattingStats?.map((s: any) => ({ 
                                                name: s.player?.name || s.name, 
                                                runs: s.runs, 
                                                balls: s.balls, 
                                                fours: s.fours, 
                                                sixes: s.sixes, 
                                                dismissal: s.dismissal,
                                                strikeRate: s.strikeRate 
                                            })) || []}
                                            bowlingStats={matchState.opponentBowlingStats?.map((s: any) => ({ 
                                                name: s.player?.name || s.name, 
                                                overs: s.overs + (s.ballsInCurrentOver / 6), 
                                                maidens: s.maidens, 
                                                runs: s.runs, 
                                                wickets: s.wickets, 
                                                economy: s.economy 
                                            })) || []}
                                            total={matchState.opponentScore}
                                            wickets={matchState.opponentWickets}
                                            overs={matchState.ballsBowled / 6}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KwikCricketPage;