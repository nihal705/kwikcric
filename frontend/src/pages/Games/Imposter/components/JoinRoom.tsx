// frontend/src/pages/Games/Imposter/components/JoinRoom.tsx
import React, { useState, useEffect } from 'react';
import { socket } from '../../../../services/socket';

interface JoinRoomProps {
  roomCode: string;
  playerName: string;
  isHost: boolean;
  onJoin: (roomCode: string) => void;
  onBack: () => void;
}

interface PlayerJoinedData {
  players: any[];
}

interface PlayerLeftData {
  players: any[];
}

interface GameStartData {
  card: any;
  theme: string;
  totalRounds: number;
  players: any[];
}

interface JoinErrorData {
  error: string;
}

export const JoinRoom: React.FC<JoinRoomProps> = ({ 
  roomCode: initialCode, 
  playerName, 
  isHost, 
  onJoin, 
  onBack 
}) => {
  const [players, setPlayers] = useState<any[]>([]);
  const [roomCode, setRoomCode] = useState(initialCode || '');
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialCode) {
      joinRoom();
    }
  }, []);

  useEffect(() => {
    const handlePlayerJoined = (data: PlayerJoinedData) => {
      setPlayers(data.players);
    };

    const handlePlayerLeft = (data: PlayerLeftData) => {
      setPlayers(data.players);
    };

    const handleGameStart = (_data: GameStartData) => {
      onJoin(roomCode);
    };

    const handleJoinError = (data: JoinErrorData) => {
      setError(data.error);
      setIsJoining(false);
    };

    socket.on('player-joined', handlePlayerJoined);
    socket.on('player-left', handlePlayerLeft);
    socket.on('game-start', handleGameStart);
    socket.on('join-error', handleJoinError);

    return () => {
      socket.off('player-joined', handlePlayerJoined);
      socket.off('player-left', handlePlayerLeft);
      socket.off('game-start', handleGameStart);
      socket.off('join-error', handleJoinError);
    };
  }, [roomCode, onJoin]);

  const joinRoom = () => {
    if (!roomCode.trim()) {
      setError('Please enter a room code');
      return;
    }
    
    setIsJoining(true);
    socket.emit('join-room', { roomCode, playerName });
  };

  const startGame = () => {
    socket.emit('start-game', { roomCode });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6">
      <div className="max-w-md mx-auto px-4">
        <button onClick={onBack} className="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900">
          ← Back
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Lobby</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Room Code
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter room code"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              disabled={!!initialCode}
            />
          </div>

          {!initialCode && (
            <button
              onClick={joinRoom}
              disabled={isJoining}
              className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition disabled:opacity-50 mb-4"
            >
              {isJoining ? 'Joining...' : 'Join Room'}
            </button>
          )}

          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Players ({players.length})</h3>
            <div className="space-y-2">
              {players.map((player, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-900 dark:text-white">{player.name}</span>
                  {player.isHost && <span className="text-xs text-yellow-600">(Host)</span>}
                </div>
              ))}
            </div>
          </div>

          {isHost && players.length >= 2 && (
            <button
              onClick={startGame}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition"
            >
              Start Game ({players.length} players)
            </button>
          )}

          {!isHost && players.length < 2 && (
            <p className="text-center text-sm text-gray-500">Waiting for host to start...</p>
          )}
        </div>
      </div>
    </div>
  );
};