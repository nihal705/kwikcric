// frontend/src/pages/Home/components/WeeklyPoll.tsx
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../../services/api/config';
import axios from 'axios';

interface Question {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answered: boolean;
  userAnswer: string | null;
}

interface PollData {
  pollId: number;
  weekNumber: number;
  year: number;
  endDate: string;
  questions: Question[];
  allAnswered: boolean;
  totalQuestions: number;
}

export const WeeklyPoll: React.FC = () => {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchPoll();
  }, []);

  const fetchPoll = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/polls/weekly/active`);
      
      if (response.data.success && response.data.data) {
        const pollData = response.data.data;
        setPoll(pollData);
        setCompleted(pollData.allAnswered);
        
        // Find first unanswered question
        const firstUnansweredIndex = pollData.questions.findIndex((q: Question) => !q.answered);
        if (firstUnansweredIndex !== -1) {
          setCurrentQuestionIndex(firstUnansweredIndex);
        }
      }
    } catch (error) {
      console.error('Error fetching poll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!poll || !selectedOption) return;
    
    const currentQuestion = poll.questions[currentQuestionIndex];
    if (!currentQuestion) return;
    
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/polls/weekly/${poll.pollId}/answer`, {
        questionId: currentQuestion.id,
        option: selectedOption
      });
      
      // Update local state
      const updatedQuestions = [...poll.questions];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        answered: true,
        userAnswer: selectedOption
      };
      
      const allAnswered = updatedQuestions.every(q => q.answered);
      setPoll({ ...poll, questions: updatedQuestions, allAnswered });
      setCompleted(allAnswered);
      setSelectedOption(null);
      
      // Move to next unanswered question
      if (!allAnswered) {
        const nextUnansweredIndex = updatedQuestions.findIndex((q, idx) => !q.answered && idx > currentQuestionIndex);
        if (nextUnansweredIndex !== -1) {
          setCurrentQuestionIndex(nextUnansweredIndex);
        }
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      alert('You have already answered this question');
    } finally {
      setSubmitting(false);
    }
  };

  const goToQuestion = (index: number) => {
    if (poll && poll.questions[index] && !poll.questions[index].answered) {
      setSelectedOption(null);
      setCurrentQuestionIndex(index);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 text-center">
        <p className="text-xs text-gray-500">New poll coming next week!</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Weekly Fan Poll</h3>
        </div>
        <div className="p-4 text-center">
          <div className="text-green-500 text-lg mb-2">✓</div>
          <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">Thank you for participating!</p>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">
            Week {poll.weekNumber} • {poll.totalQuestions} questions answered
          </p>
          <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-2">
            See you next week for new questions
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = poll.questions[currentQuestionIndex];
  const progress = ((poll.questions.filter(q => q.answered).length) / poll.totalQuestions) * 100;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700/50 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-xs">Weekly Fan Poll</h3>
          <span className="text-[9px] text-gray-500">
            Week {poll.weekNumber} • {formatDate(poll.endDate)}
          </span>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-0.5 bg-gray-200 dark:bg-gray-700">
        <div className="h-0.5 bg-yellow-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      </div>
      
      <div className="p-3">
        {/* Question Indicators */}
        <div className="flex gap-1 mb-3">
          {poll.questions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => goToQuestion(idx)}
              disabled={q.answered}
              className={`flex-1 py-1 text-center text-[9px] font-medium rounded transition-all ${
                idx === currentQuestionIndex
                  ? 'bg-yellow-500 text-white'
                  : q.answered
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400 cursor-default'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        
        {/* Current Question */}
        <p className="text-xs font-medium text-gray-800 dark:text-white mb-3">
          {currentQuestionIndex + 1}. {currentQuestion.question}
        </p>
        
        {/* Options */}
        <div className="space-y-2">
          {Object.entries(currentQuestion.options).map(([key, value]) => (
            <label key={key} className="flex items-start gap-2 cursor-pointer">
              <input
                type="radio"
                name="question"
                value={key}
                checked={selectedOption === key}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="w-3 h-3 mt-0.5 text-yellow-500 focus:ring-yellow-500"
              />
              <span className="text-[11px] text-gray-700 dark:text-gray-300 leading-relaxed">{value}</span>
            </label>
          ))}
        </div>
        
        {/* Submit Button */}
        <button
          onClick={handleSubmitAnswer}
          disabled={!selectedOption || submitting}
          className="w-full mt-3 px-3 py-1.5 bg-yellow-500 text-white text-xs font-medium rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </button>
        
        <p className="text-center text-[9px] text-gray-400 dark:text-gray-500 mt-2">
          Question {currentQuestionIndex + 1} of {poll.totalQuestions}
        </p>
      </div>
    </div>
  );
};