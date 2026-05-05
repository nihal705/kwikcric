// frontend/src/pages/Games/Imposter/components/CreateRoom.tsx
import React, { useState } from 'react';
import { socket } from '../../../../services/socket';

interface CreateRoomProps {
  playerName: string;
  theme: string;
  totalRounds: number;
  onCreate: (roomCode: string) => void;
  onBack: () => void;
}

interface RoomCreatedData {
  roomCode: string;
  players: any[];
  isHost: boolean;
}

interface JoinErrorData {
  error: string;
}

export const CreateRoom: React.FC<CreateRoomProps> = ({ 
  playerName, 
  theme, 
  totalRounds, 
  onCreate, 
  onBack 
}) => {
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const generateRoomCode = () => {
    return 'IMP' + Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreate = () => {
    setIsCreating(true);
    const code = generateRoomCode();
    setRoomCode(code);
    
    socket.emit('create-room', {
      roomCode: code,
      playerName,
      theme,
      totalRounds,
      isHost: true
    });
    
    socket.once('room-created', (_data: RoomCreatedData) => {
      onCreate(code);
    });
    
    socket.once('join-error', (data: JoinErrorData) => {
      setError(data.error);
      setIsCreating(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <button onClick={onBack} className="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900">
          ← Back
        </button>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Create Room</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Room code will be generated automatically</p>
          {roomCode && (
            <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-center">
              <p className="text-xs text-gray-500">Your Room Code</p>
              <p className="text-2xl font-bold text-green-600">{roomCode}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleCreate}
          disabled={isCreating}
          className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition disabled:opacity-50"
        >
          {isCreating ? 'Creating...' : 'Create Room'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-4">
          Share the room code with friends to join
        </p>
      </div>
    </div>
  );
};