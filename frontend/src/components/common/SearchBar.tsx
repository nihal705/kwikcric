import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX } from 'react-icons/fi';
import { useDebounce } from '../../hooks/useDebounce';
import { playerAPI } from '../../services/api/playerAPI';

interface SearchResult {
  id: string;
  full_name: string;
  country: string;
  role: string;
  image_url: string | null;
}

export const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchPlayers();
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  const searchPlayers = async () => {
    setIsLoading(true);
    try {
      const response = await playerAPI.searchPlayers(debouncedQuery, 10);
      setResults(response.data || []);
      setIsOpen(true);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (playerId: string) => {
    setQuery('');
    setIsOpen(false);
    navigate(`/player/${playerId}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search players, teams, tournaments..."
          className="w-full pl-10 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {query && (
          <button onClick={handleClear} className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <FiX className="text-gray-400 hover:text-gray-600" size={16} />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              {results.map((player) => (
                <button
                  key={player.id}
                  onClick={() => handleSelect(player.id)}
                  className="w-full flex items-center space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                    <img
                      src={player.image_url || '/assets/default-player.png'}
                      alt={player.full_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 dark:text-white">{player.full_name}</div>
                    <div className="text-sm text-gray-500">{player.country} • {player.role || 'Cricketer'}</div>
                  </div>
                </button>
              ))}
            </div>
          ) : debouncedQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">No players found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};