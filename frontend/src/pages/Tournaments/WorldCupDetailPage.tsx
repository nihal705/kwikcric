// frontend/src/pages/Tournaments/WorldCupDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { worldCupAPI, Tournament, Match, PointsTableEntry, FullTournamentDetails } from '../../services/api/worldCupAPI';
import { TournamentStats } from './components/TournamentStats';
import { TournamentAchievements } from './components/TournamentAchievements';

type TabType = 'overview' | 'pointsTable' | 'matches' | 'stats' | 'achievements';

// Map URL type to API type
const mapTournamentType = (type: string | undefined): string => {
    if (type === 't20') return 't20';
    if (type === 'champions') return 'champions';
    if (type === 'test' || type === 'wtc') return 'test';
    return 'odi';
};

// Get display name for tournament
const getTournamentDisplayName = (type: string): string => {
    switch (type) {
        case 't20': return 'T20I World Cup';
        case 'champions': return 'Champions Trophy';
        case 'test': return 'ICC World Test Championship';
        default: return 'ODI World Cup';
    }
};

export const WorldCupDetailPage: React.FC = () => {
  const { year, type } = useParams<{ year: string; type?: string }>();
  
  // Log the params to debug
  console.log('URL Params:', { year, type });
  
  // Map URL type to API type
  const tournamentType = mapTournamentType(type);
  console.log('Mapped tournament type:', tournamentType);
    
    // FIX 1: Handle undefined year - if no year, show error
    const [details, setDetails] = useState<FullTournamentDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (year) {
            fetchDetails();
        } else {
            setError('No tournament year specified');
            setLoading(false);
        }
    }, [year, tournamentType]);

    // In the fetchDetails function, make sure we're using the tournamentType state
    const fetchDetails = async () => {
    if (!year) return;
    
    setLoading(true);
    setError(null);
    try {
        const yearNum = parseInt(year);
        if (isNaN(yearNum)) {
            throw new Error('Invalid year format');
        }
        // Use the tournamentType state (not the URL param directly)
        const data = await worldCupAPI.getFullTournamentDetails(yearNum, tournamentType);
        console.log('Tournament details:', data);
        setDetails(data);
    } catch (error) {
        console.error('Error fetching tournament details:', error);
        setError('Failed to load tournament details. Please check if backend is running.');
    } finally {
        setLoading(false);
    }
};

    // Helper to get gradient color based on tournament type
    const getGradientColor = () => {
        switch (tournamentType) {
            case 't20': return 'from-purple-700 to-pink-700';
            case 'champions': return 'from-blue-700 to-cyan-700';
            case 'test': return 'from-teal-700 to-emerald-700';
            default: return 'from-green-700 to-green-900';
        }
    };

    // Helper to get accent color for tabs
    const getAccentColor = () => {
        switch (tournamentType) {
            case 't20': return 'text-purple-600 border-purple-600';
            case 'champions': return 'text-blue-600 border-blue-600';
            case 'test': return 'text-teal-600 border-teal-600';
            default: return 'text-green-600 border-green-600';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent" />
            </div>
        );
    }

    if (error || !details || !year) {
        return (
            <div className="text-center py-20">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold mb-2">{error || 'Tournament not found'}</h2>
                <Link to={`/world-cup${tournamentType !== 'odi' ? `/${tournamentType}` : ''}`} className="text-green-600 hover:underline">
                    Back to {getTournamentDisplayName(tournamentType)}
                </Link>
            </div>
        );
    }

    const { tournament, matches, pointsTable } = details;
    const displayName = getTournamentDisplayName(tournamentType);
    const accentColor = getAccentColor();

    const tabs: { id: TabType; label: string; icon: string }[] = [
        { id: 'overview', label: 'Overview', icon: '🏆' },
        { id: 'pointsTable', label: 'Points Table', icon: '📊' },
        { id: 'matches', label: 'Matches', icon: '🏏' },
        { id: 'stats', label: 'Stats', icon: '📈' },
        { id: 'achievements', label: 'Moments', icon: '⭐' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className={`relative bg-gradient-to-r ${getGradientColor()} py-8 md:py-12`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link 
                        to={`/world-cup${tournamentType !== 'odi' ? `/${tournamentType}` : ''}`} 
                        className="inline-flex items-center text-white/80 hover:text-white text-sm mb-3 md:mb-4"
                    >
                        ← Back to {displayName}
                    </Link>
                    <div className="text-center">
    <img 
        src="/images/icc_odi_wc_trophy.png"
        alt="ICC Cricket World Cup Trophy"
        className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 object-contain"
    />
    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
        {displayName} {tournament.year}
    </h1>
    <p className="text-xs md:text-sm text-white/80">
        Hosted by {tournament.host_country} • {tournament.total_teams} Teams • {tournament.total_matches} Matches
    </p>
</div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* Tab Navigation */}
                <div className="flex flex-wrap justify-center gap-1 border-b border-gray-200 dark:border-gray-700 mb-6 md:mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 md:px-6 md:py-3 font-semibold transition-all flex items-center gap-1 md:gap-2 text-sm md:text-base ${
                                activeTab === tab.id
                                    ? accentColor + ' border-b-2'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-5 md:space-y-6"
                        >
                            <OverviewSection tournament={tournament} tournamentType={tournamentType} />
                        </motion.div>
                    )}

                    {activeTab === 'pointsTable' && pointsTable && pointsTable.length > 0 && (
                        <motion.div
                            key="pointsTable"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <PointsTableSection pointsTable={pointsTable} tournamentType={tournamentType} />
                        </motion.div>
                    )}

                    {activeTab === 'matches' && (
                        <motion.div
                            key="matches"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <MatchesSection matches={matches || []} tournamentType={tournamentType} />
                        </motion.div>
                    )}

                    {activeTab === 'stats' && (
                        <motion.div
                            key="stats"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* FIX 2: Remove tournamentType prop or update TournamentStats component */}
                            <TournamentStats tournamentId={details.tournament.id} year={details.tournament.year} />
                        </motion.div>
                    )}

                    {activeTab === 'achievements' && (
                        <motion.div
                            key="achievements"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <TournamentAchievements tournamentId={details.tournament.id} year={details.tournament.year} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

// Overview Section Component
const OverviewSection: React.FC<{ tournament: Tournament; tournamentType: string }> = ({ tournament, tournamentType }) => {
    const getWinnerGradient = () => {
        switch (tournamentType) {
            case 't20': return 'from-purple-500 to-pink-500';
            case 'champions': return 'from-blue-500 to-cyan-500';
            case 'test': return 'from-teal-500 to-emerald-500';
            default: return 'from-yellow-500 to-orange-500';
        }
    };

    return (
        <div className="space-y-5 md:space-y-6">
            {/* Winner Card */}
            <div className={`bg-gradient-to-r ${getWinnerGradient()} rounded-xl p-5 md:p-8 text-white text-center`}>
                <div className="text-4xl md:text-5xl mb-3 md:mb-4">
                  <img 
                      src="/images/icc_odi_wc_trophy.png"
                      alt="ICC Cricket World Cup Trophy"
                      className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 object-contain"
                  />
            </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">{tournament.winner_name || 'TBD'}</h2>
                <p className="text-base md:text-lg">{tournament.tournament_type?.toUpperCase() || 'World Cup'} {tournament.year} Champions</p>
                {tournament.runner_up_name && (
                    <p className="text-xs md:text-sm mt-2 text-white/80">
                        Defeated {tournament.runner_up_name} in the final
                    </p>
                )}
            </div>

            {/* Tournament Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 shadow text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl md:text-4xl mb-1 md:mb-2">📍</div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500 mb-0.5 md:mb-1">Host Country</h3>
                    <p className="text-sm md:text-xl font-bold">{tournament.host_country}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 shadow text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl md:text-4xl mb-1 md:mb-2">🏏</div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500 mb-0.5 md:mb-1">Total Matches</h3>
                    <p className="text-sm md:text-xl font-bold">{tournament.total_matches}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-3 md:p-6 shadow text-center border border-gray-200 dark:border-gray-700">
                    <div className="text-3xl md:text-4xl mb-1 md:mb-2">👥</div>
                    <h3 className="text-xs md:text-sm font-semibold text-gray-500 mb-0.5 md:mb-1">Teams</h3>
                    <p className="text-sm md:text-xl font-bold">{tournament.total_teams}</p>
                </div>
            </div>

            {/* Captain and Player of Tournament */}
            {(tournament.winner_captain || tournament.player_of_tournament) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4">Key Figures</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {tournament.winner_captain && (
                            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-xl md:text-2xl">👑</span>
                                <div>
                                    <div className="text-xs text-gray-500">Winning Captain</div>
                                    <div className="text-sm md:text-base font-semibold">{tournament.winner_captain}</div>
                                </div>
                            </div>
                        )}
                        {tournament.player_of_tournament && (
                            <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <span className="text-xl md:text-2xl">⭐</span>
                                <div>
                                    <div className="text-xs text-gray-500">Player of the Tournament</div>
                                    <div className="text-sm md:text-base font-semibold">{tournament.player_of_tournament}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Final Match Info */}
            {tournament.final_match_venue && (
                <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl p-4 md:p-6 shadow border border-gray-200 dark:border-gray-700">
                    <h3 className="text-base md:text-xl font-bold mb-3 md:mb-4">Final Match</h3>
                    <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
                        <div>
                            <div className="text-xs text-gray-500">Venue</div>
                            <div className="text-sm md:text-base font-semibold">{tournament.final_match_venue}</div>
                        </div>
                        {tournament.final_match_date && (
                            <div>
                                <div className="text-xs text-gray-500">Date</div>
                                <div className="text-sm md:text-base font-semibold">{new Date(tournament.final_match_date).toLocaleDateString()}</div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// Points Table Section Component
const PointsTableSection: React.FC<{ pointsTable: PointsTableEntry[]; tournamentType: string }> = ({ pointsTable, tournamentType }) => {
    if (!pointsTable || pointsTable.length === 0) {
        return (
            <div className="text-center py-8 md:py-12 text-gray-500">
                <p>Points table data not available for this tournament.</p>
            </div>
        );
    }

    const formatNRR = (nrr: any): string => {
        if (nrr === null || nrr === undefined) return '0.000';
        const num = typeof nrr === 'string' ? parseFloat(nrr) : nrr;
        if (isNaN(num)) return '0.000';
        return num.toFixed(3);
    };

    // Group by group_name
    const groups: Record<string, PointsTableEntry[]> = {};
    pointsTable.forEach((entry: PointsTableEntry) => {
        const group = entry.group_name || 'Group';
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(entry);
    });

    // Sort each group by points, then NRR
    Object.keys(groups).forEach(group => {
        groups[group].sort((a, b) => {
            if (a.points !== b.points) return b.points - a.points;
            return (b.net_run_rate || 0) - (a.net_run_rate || 0);
        });
    });

    const getAccentBg = () => {
        switch (tournamentType) {
            case 't20': return 'bg-purple-100 dark:bg-purple-900/20';
            case 'champions': return 'bg-blue-100 dark:bg-blue-900/20';
            case 'test': return 'bg-teal-100 dark:bg-teal-900/20';
            default: return 'bg-green-50 dark:bg-green-900/10';
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {Object.entries(groups).map(([groupName, entries]) => (
                <div key={groupName} className="bg-white dark:bg-gray-800 rounded-lg md:rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="bg-gray-100 dark:bg-gray-700 px-4 md:px-6 py-2 md:py-3">
                        <h3 className="font-bold text-base md:text-lg">{groupName}</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs md:text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-3 md:px-4 py-2 md:py-3 text-left">Team</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-center">MP</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-center">W</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-center">L</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-center">T</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-center">NR</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-center">Pts</th>
                                    <th className="px-2 md:px-4 py-2 md:py-3 text-center">NRR</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry: PointsTableEntry, idx: number) => (
                                    <tr key={idx} className={`border-b border-gray-100 dark:border-gray-700 ${
                                        idx < 2 ? getAccentBg() : ''
                                    }`}>
                                        <td className="px-3 md:px-4 py-2 md:py-3 font-medium text-xs md:text-sm">{entry.team_name}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 text-center">{entry.matches_played}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 text-center text-green-600 font-medium">{entry.matches_won}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 text-center text-red-600">{entry.matches_lost}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 text-center">{entry.matches_tied || 0}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 text-center">{entry.matches_nr || 0}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 text-center font-bold">{entry.points}</td>
                                        <td className="px-2 md:px-4 py-2 md:py-3 text-center font-mono">{formatNRR(entry.net_run_rate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Matches Section Component
const MatchesSection: React.FC<{ matches: Match[]; tournamentType: string }> = ({ matches, tournamentType }) => {
    const [filter, setFilter] = useState<'all' | 'group' | 'knockout'>('all');

    if (!matches || matches.length === 0) {
        return (
            <div className="text-center py-8 md:py-12 text-gray-500">
                <p>Match data not available for this tournament.</p>
            </div>
        );
    }

    const groupMatches = matches.filter((match: Match) => 
        match.match_type === 'group' || match.match_type === 'group_stage'
    );
    const knockoutMatches = matches.filter((match: Match) => 
        match.match_type === 'semifinal' || match.match_type === 'final' || match.match_type === 'quarterfinal'
    );

    let displayMatches = matches;
    if (filter === 'group') displayMatches = groupMatches;
    if (filter === 'knockout') displayMatches = knockoutMatches;

    displayMatches = [...displayMatches].sort((a, b) => 
        new Date(a.match_date).getTime() - new Date(b.match_date).getTime()
    );

    const getKnockoutColor = () => {
        switch (tournamentType) {
            case 't20': return 'border-purple-400 dark:border-purple-600';
            case 'champions': return 'border-blue-400 dark:border-blue-600';
            case 'test': return 'border-teal-400 dark:border-teal-600';
            default: return 'border-yellow-400 dark:border-yellow-600';
        }
    };

    return (
        <div className="space-y-5 md:space-y-6">
            <div className="flex flex-wrap justify-center gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
                        filter === 'all'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                >
                    All Matches ({matches.length})
                </button>
                <button
                    onClick={() => setFilter('group')}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
                        filter === 'group'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                >
                    Group Stage ({groupMatches.length})
                </button>
                <button
                    onClick={() => setFilter('knockout')}
                    className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium text-xs md:text-sm transition ${
                        filter === 'knockout'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                    }`}
                >
                    Knockouts ({knockoutMatches.length})
                </button>
            </div>

            {(filter === 'all' || filter === 'knockout') && knockoutMatches.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 dark:text-gray-300">Knockout Stage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {knockoutMatches.map((match: Match) => (
                            <MatchCard key={match.id} match={match} isKnockout={true} knockoutColor={getKnockoutColor()} />
                        ))}
                    </div>
                </div>
            )}

            {(filter === 'all' || filter === 'group') && groupMatches.length > 0 && (
                <div className="space-y-3 md:space-y-4">
                    <h3 className="text-lg md:text-xl font-bold text-center text-gray-700 dark:text-gray-300">Group Stage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {groupMatches.map((match: Match) => (
                            <MatchCard key={match.id} match={match} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Individual Match Card Component
const MatchCard: React.FC<{ match: Match; isKnockout?: boolean; knockoutColor?: string }> = ({ match, isKnockout, knockoutColor }) => {
    const isAbandoned = match.is_abandoned === true;
    
    const formatScore = (runs: number | null, wickets: number | null, overs: number | null) => {
        if (runs === null && isAbandoned) return 'Abandoned';
        if (runs === null) return 'N/A';
        const wicketsStr = wickets !== null ? `/${wickets}` : '';
        const oversStr = overs !== null ? ` (${overs} ov)` : '';
        return `${runs}${wicketsStr}${oversStr}`;
    };
    
    const getWinnerMessage = () => {
        if (isAbandoned) {
            if (match.result_note) return match.result_note;
            if (match.abandonment_reason) return `Match abandoned due to ${match.abandonment_reason}`;
            return 'Match abandoned';
        }
        if (!match.winner_name) return '';
        if (match.winner_margin && match.margin_type) {
            return `${match.winner_name} won by ${match.winner_margin} ${match.margin_type}`;
        }
        if (match.result_note) return match.result_note;
        return `${match.winner_name} won`;
    };
    
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow border ${
            isKnockout && knockoutColor ? knockoutColor : 'border-gray-200 dark:border-gray-700'
        } ${isAbandoned ? 'bg-gray-100 dark:bg-gray-800/50' : ''}`}>
            <div className="text-center mb-2 md:mb-3">
                <span className="text-xs text-gray-500">{match.match_date ? new Date(match.match_date).toLocaleDateString() : 'Date TBD'}</span>
                <span className="mx-1 md:mx-2">•</span>
                <span className="text-xs text-gray-500">{match.venue?.split(',')[0] || 'Venue TBD'}</span>
                {match.match_type === 'final' && !isAbandoned && (
                    <span className="ml-1 md:ml-2 text-xs bg-yellow-500 text-white px-1.5 py-0.5 rounded-full">FINAL</span>
                )}
                {match.match_type === 'semifinal' && !isAbandoned && (
                    <span className="ml-1 md:ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full">SF</span>
                )}
                {isAbandoned && (
                    <span className="ml-1 md:ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">ABANDONED</span>
                )}
            </div>
            
            <div className="space-y-1 md:space-y-2">
                <div className={`flex justify-between items-center p-1.5 rounded ${
                    !isAbandoned && match.winner_name === match.team1_name ? 'bg-green-50 dark:bg-green-900/20' : ''
                }`}>
                    <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-sm md:text-base font-medium">{match.team1_name}</span>
                        {!isAbandoned && match.winner_name === match.team1_name && (
                            <span className="text-green-600 text-xs font-semibold">✓</span>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="font-mono font-semibold text-xs md:text-sm">
                            {formatScore(match.team1_score, match.team1_wickets, match.team1_overs)}
                        </span>
                    </div>
                </div>
                
                <div className={`flex justify-between items-center p-1.5 rounded ${
                    !isAbandoned && match.winner_name === match.team2_name ? 'bg-green-50 dark:bg-green-900/20' : ''
                }`}>
                    <div className="flex items-center gap-1 md:gap-2">
                        <span className="text-sm md:text-base font-medium">{match.team2_name}</span>
                        {!isAbandoned && match.winner_name === match.team2_name && (
                            <span className="text-green-600 text-xs font-semibold">✓</span>
                        )}
                    </div>
                    <div className="text-right">
                        <span className="font-mono font-semibold text-xs md:text-sm">
                            {formatScore(match.team2_score, match.team2_wickets, match.team2_overs)}
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="mt-2 md:mt-3 pt-1.5 md:pt-2 border-t border-gray-100 dark:border-gray-700 text-center">
                <span className={`text-xs md:text-sm font-semibold ${isAbandoned ? 'text-orange-600' : 'text-green-600'}`}>
                    {getWinnerMessage()}
                </span>
                {match.man_of_match_name && !isAbandoned && (
                    <div className="text-xs text-gray-500 mt-1">
                        🏅 Player of the Match: {match.man_of_match_name}
                    </div>
                )}
            </div>
        </div>
    );
};