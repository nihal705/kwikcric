import React from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';

interface QuestionCardProps {
  question: {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    points: number;
    category: string;
    difficulty: string;
  };
  selectedAnswer: string | null;
  isAnswered: boolean;
  showExplanation: boolean;
  onAnswer: (answer: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  isAnswered,
  showExplanation,
  onAnswer,
}) => {
  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      {/* Question Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            {question.category}
          </span>
          <span className={`px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs ${getDifficultyColor()}`}>
            {question.difficulty.toUpperCase()}
          </span>
        </div>
        <span className="text-sm font-semibold text-green-600">
          {question.points} pts
        </span>
      </div>

      {/* Question Text */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {question.questionText}
      </h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === question.correctAnswer;
          
          let optionStyle = "border-gray-300 dark:border-gray-600 hover:border-green-500";
          if (isAnswered) {
            if (isCorrectAnswer) {
              optionStyle = "border-green-500 bg-green-50 dark:bg-green-900/20";
            } else if (isSelected && !isCorrectAnswer) {
              optionStyle = "border-red-500 bg-red-50 dark:bg-red-900/20";
            }
          } else if (isSelected) {
            optionStyle = "border-green-500 bg-green-50 dark:bg-green-900/20";
          }

          return (
            <motion.button
              key={option}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              onClick={() => !isAnswered && onAnswer(option)}
              disabled={isAnswered}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${optionStyle}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-gray-500">{String.fromCharCode(65 + index)}.</span>
                  <span className="text-gray-900 dark:text-white">{option}</span>
                </div>
                {isAnswered && isCorrectAnswer && (
                  <FiCheck className="text-green-500" size={20} />
                )}
                {isAnswered && isSelected && !isCorrectAnswer && (
                  <FiX className="text-red-500" size={20} />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 p-4 rounded-lg ${
            isCorrect
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {question.explanation}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};