// frontend/src/pages/Home/components/InteractivePoll.tsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../services/api/config';
import axios from 'axios';

interface PollData {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  hasVoted: boolean;
}

export const InteractivePoll: React.FC = () => {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [voted, setVoted] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/polls/active`);
      
      if (response.data.success && response.data.data) {
        setPoll(response.data.data);
        setVoted(response.data.data.hasVoted);
      }
    } catch (error) {
      console.error('Error fetching poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async () => {
    if (!selectedOption || !poll || voting || voted) return;
    
    setVoting(true);
    try {
      const response = await axios.post(`{API_BASE_URL}/polls/${poll.id}/vote`, {
        option: selectedOption
      });
      
      if (response.data.success) {
        setVoted(true);
        // Show thank you message
        alert('Thank you for your valuable opinion!');
      }
    } catch (error) {
      console.error('Error submitting vote:', error);
      alert('You have already voted or an error occurred.');
    } finally {
      setVoting(false);
    }
  };

  const options = poll ? [
    { key: 'A', text: poll.option_a },
    { key: 'B', text: poll.option_b },
    { key: 'C', text: poll.option_c },
    { key: 'D', text: poll.option_d }
  ] : [];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 text-center">
        <p className="text-xs text-gray-500">No active poll available</p>
      </div>
    );
  }

  if (voted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Fan Poll</h3>
        </div>
        <div className="p-4 text-center">
          <div className="text-green-500 text-lg mb-2">✓</div>
          <p className="text-xs text-gray-700 dark:text-gray-300">Thank you for sharing your opinion!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Fan Poll</h3>
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-gray-800 dark:text-white mb-3">{poll.question}</p>
        
        <div className="space-y-2">
          {options.map((option) => (
            <label key={option.key} className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="poll"
                value={option.key}
                checked={selectedOption === option.key}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-3 h-3 mt-0.5 text-yellow-500 focus:ring-yellow-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">{option.text}</span>
            </label>
          ))}
        </div>
        
        <button
          onClick={handleVote}
          disabled={!selectedOption || voting}
          className="w-full mt-3 px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {voting ? 'Submitting...' : 'Submit Vote'}
        </button>
        
        <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 mt-2">
          Your opinion is anonymous and valuable
        </p>
      </div>
    </div>
  );
};