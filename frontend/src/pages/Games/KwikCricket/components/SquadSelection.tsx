// frontend/src/pages/Games/KwikCricket/components/SquadSelection.tsx
import React, { useState } from 'react';
import { Player, getPlayersByTeam, getRandomOpponentSquad } from '../data/playersData';

interface SquadSelectionProps {
    teamName: string;
    opponentTeamName: string;
    onConfirm: (userSquad: Player[], opponentSquad: Player[], battingOrder: Player[]) => void;
    onBack: () => void;
}

export const SquadSelection: React.FC<SquadSelectionProps> = ({ 
    teamName, 
    opponentTeamName, 
    onConfirm, 
    onBack 
}) => {
    const [activeTeam, setActiveTeam] = useState<'user' | 'opponent'>('user');
    const [userSquad, setUserSquad] = useState<Player[]>(() => getRandomOpponentSquad(teamName));
    const [opponentSquad, setOpponentSquad] = useState<Player[]>(() => getRandomOpponentSquad(opponentTeamName));
    const [battingOrder, setBattingOrder] = useState<Player[]>([]);
    const [step, setStep] = useState<'select' | 'batting'>('select');
    
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    // Use getPlayersByTeam instead of getPlayersByCountry
    const availablePlayers = getPlayersByTeam(teamName);
    const opponentAvailablePlayers = getPlayersByTeam(opponentTeamName);

    const togglePlayerSelection = (player: Player, isUser: boolean) => {
        if (isUser) {
            if (userSquad.find(p => p.id === player.id)) {
                setUserSquad(userSquad.filter(p => p.id !== player.id));
            } else if (userSquad.length < 11) {
                setUserSquad([...userSquad, player]);
            }
        } else {
            if (opponentSquad.find(p => p.id === player.id)) {
                setOpponentSquad(opponentSquad.filter(p => p.id !== player.id));
            } else if (opponentSquad.length < 11) {
                setOpponentSquad([...opponentSquad, player]);
            }
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'batsman': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
            case 'bowler': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
            case 'allrounder': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            case 'wicketkeeper': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300';
            default: return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300';
        }
    };

    const handleNextToBatting = () => {
        if (userSquad.length === 11 && opponentSquad.length === 11) {
            setBattingOrder([...userSquad]);
            setStep('batting');
        }
    };

    // Move batsman up in order
    const moveUp = (index: number) => {
        if (index === 0) return;
        const newOrder = [...battingOrder];
        [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        setBattingOrder(newOrder);
    };

    // Move batsman down in order
    const moveDown = (index: number) => {
        if (index === battingOrder.length - 1) return;
        const newOrder = [...battingOrder];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        setBattingOrder(newOrder);
    };

    // Drag and drop handlers
    const handleDragStart = (e: React.DragEvent, index: number) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', index.toString());
        setDraggedItemIndex(index);
        e.currentTarget.classList.add('opacity-50');
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDragEnd = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('opacity-50');
        setDraggedItemIndex(null);
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        
        const sourceIndex = draggedItemIndex;
        if (sourceIndex === null || sourceIndex === targetIndex) {
            setDraggedItemIndex(null);
            return;
        }

        const newOrder = [...battingOrder];
        const [draggedItem] = newOrder.splice(sourceIndex, 1);
        newOrder.splice(targetIndex, 0, draggedItem);
        setBattingOrder(newOrder);
        
        setDraggedItemIndex(null);
    };

    const randomizeSquad = (isUser: boolean) => {
        if (isUser) {
            setUserSquad(getRandomOpponentSquad(teamName));
        } else {
            setOpponentSquad(getRandomOpponentSquad(opponentTeamName));
        }
    };

    const handleComplete = () => {
        onConfirm(userSquad, opponentSquad, battingOrder);
    };

    if (step === 'select') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3">
                    <h2 className="text-lg font-bold text-white">Select Your Squad</h2>
                    <p className="text-xs text-green-200">Choose 11 players for each team</p>
                </div>

                <div className="flex border-b border-gray-200 dark:border-gray-700">
                    <button 
                        onClick={() => setActiveTeam('user')}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${activeTeam === 'user' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500'}`}
                    >
                        {teamName} ({userSquad.length}/11)
                    </button>
                    <button 
                        onClick={() => setActiveTeam('opponent')}
                        className={`flex-1 px-4 py-2 text-sm font-medium ${activeTeam === 'opponent' ? 'text-green-600 border-b-2 border-green-500' : 'text-gray-500'}`}
                    >
                        {opponentTeamName} ({opponentSquad.length}/11)
                    </button>
                </div>

                <div className="flex justify-between items-center px-4 py-2 bg-gray-50 dark:bg-gray-900/30 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500">Click on player to select/deselect</span>
                    <button onClick={() => randomizeSquad(activeTeam === 'user')} className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        🎲 Random
                    </button>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                        {(activeTeam === 'user' ? availablePlayers : opponentAvailablePlayers).map(player => {
                            const isSelected = activeTeam === 'user' 
                                ? userSquad.find(p => p.id === player.id) 
                                : opponentSquad.find(p => p.id === player.id);
                            return (
                                <div 
                                    key={player.id}
                                    onClick={() => togglePlayerSelection(player, activeTeam === 'user')}
                                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                                        isSelected 
                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-500' 
                                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-lg">
                                            🏏
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">{player.name}</div>
                                            <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(player.role)}`}>
                                                {player.role}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Bat: {player.battingAbility}</div>
                                        <div className="text-sm text-gray-500">Bowl: {player.bowlingAbility}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/30">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Selected Squad:</div>
                    <div className="flex flex-wrap gap-1">
                        {(activeTeam === 'user' ? userSquad : opponentSquad).map(player => (
                            <span key={player.id} className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                                {player.name.split(' ')[0]}
                            </span>
                        ))}
                        {(activeTeam === 'user' ? userSquad.length < 11 : opponentSquad.length < 11) && (
                            <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full">
                                Need {11 - (activeTeam === 'user' ? userSquad.length : opponentSquad.length)} more
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={onBack} className="flex-1 px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-400 transition">
                        Back
                    </button>
                    <button 
                        onClick={handleNextToBatting}
                        disabled={userSquad.length !== 11 || opponentSquad.length !== 11}
                        className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next: Set Batting Order →
                    </button>
                </div>
            </div>
        );
    }

    if (step === 'batting') {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-3">
                    <h2 className="text-lg font-bold text-white">Set Batting Order</h2>
                    <p className="text-xs text-green-200">Drag any player to reorder • Click ↑ ↓ for fine adjustments</p>
                </div>

                <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-center">
                    <span className="text-xs text-yellow-700 dark:text-yellow-400">
                        💡 Tip: Drag the ⋮⋮ handle to move players anywhere
                    </span>
                </div>

                <div className="p-4 max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                        {battingOrder.map((player, idx) => (
                            <div 
                                key={player.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, idx)}
                                onDragOver={handleDragOver}
                                onDragEnd={handleDragEnd}
                                onDrop={(e) => handleDrop(e, idx)}
                                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-move group"
                            >
                                <div className="cursor-grab active:cursor-grabbing text-gray-400 text-lg select-none">
                                    ⋮⋮
                                </div>
                                
                                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center font-bold text-green-700 dark:text-green-300">
                                    {idx + 1}
                                </div>
                                
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">{player.name}</div>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(player.role)}`}>
                                            {player.role}
                                        </span>
                                        <span className="text-xs text-gray-500">Bat: {player.battingAbility}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                        onClick={() => moveUp(idx)}
                                        disabled={idx === 0}
                                        className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Move Up"
                                    >
                                        ↑
                                    </button>
                                    <button 
                                        onClick={() => moveDown(idx)}
                                        disabled={idx === battingOrder.length - 1}
                                        className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-500 disabled:opacity-40 disabled:cursor-not-allowed"
                                        title="Move Down"
                                    >
                                        ↓
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/30">
                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Total: {battingOrder.length}</span>
                        <span>Batsmen: {battingOrder.filter(p => p.role === 'batsman').length}</span>
                        <span>All-rounders: {battingOrder.filter(p => p.role === 'allrounder').length}</span>
                        <span>Bowlers: {battingOrder.filter(p => p.role === 'bowler').length}</span>
                    </div>
                </div>

                <div className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={() => setStep('select')} className="flex-1 px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-400 transition">
                        Back
                    </button>
                    <button onClick={handleComplete} className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition">
                        Start Match →
                    </button>
                </div>
            </div>
        );
    }

    return null;
};