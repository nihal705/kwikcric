import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct: string;
  explanation: string;
}

const questions: Question[] = [
  {
    id: 1,
    text: "Who holds the record for the most runs in ODI cricket?",
    options: ["Sachin Tendulkar", "Virat Kohli", "Ricky Ponting", "Kumar Sangakkara"],
    correct: "Sachin Tendulkar",
    explanation: "Sachin Tendulkar scored 18,426 runs in ODIs, the most by any player.",
  },
  {
    id: 2,
    text: "Which team won the first T20 World Cup in 2007?",
    options: ["India", "Pakistan", "Australia", "Sri Lanka"],
    correct: "India",
    explanation: "India defeated Pakistan in the final to win the inaugural T20 World Cup.",
  },
  {
    id: 3,
    text: "Who has taken the most wickets in Test cricket?",
    options: ["Muttiah Muralitharan", "Shane Warne", "James Anderson", "Anil Kumble"],
    correct: "Muttiah Muralitharan",
    explanation: "Muttiah Muralitharan took 800 Test wickets, the most in history.",
  },
  {
    id: 4,
    text: "Which batsman has the highest individual score in ODIs?",
    options: ["Rohit Sharma", "Martin Guptill", "Chris Gayle", "Sachin Tendulkar"],
    correct: "Rohit Sharma",
    explanation: "Rohit Sharma scored 264 runs against Sri Lanka in 2014.",
  },
  {
    id: 5,
    text: "How many World Cups has Australia won?",
    options: ["5", "4", "6", "3"],
    correct: "5",
    explanation: "Australia has won 5 World Cups (1987, 1999, 2003, 2007, 2015).",
  },
];

export const QuizPage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [answers, setAnswers] = useState<{ questionId: number; isCorrect: boolean }[]>([]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const isCorrect = answer === currentQuestion.correct;
    
    if (isCorrect) {
      setScore(score + 10);
    }
    
    setAnswers([...answers, { questionId: currentQuestion.id, isCorrect }]);
    setShowExplanation(true);
    
    setTimeout(() => {
      if (currentIndex + 1 < questions.length) {
        setCurrentIndex(currentIndex + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
      } else {
        setIsComplete(true);
      }
    }, 3000);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsComplete(false);
    setAnswers([]);
  };

  if (isComplete) {
    const percentage = (score / (questions.length * 10)) * 100;
    let message = '';
    if (percentage >= 80) message = '🏆 Excellent! You\'re a cricket master!';
    else if (percentage >= 60) message = '🎯 Good job! Keep learning!';
    else message = '📚 Keep practicing! You\'ll get better!';

    return (
      <div className="max-w-2xl mx-auto">
        <div className="card p-8 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
          <p className="text-gray-500 mb-6">{message}</p>
          <div className="text-5xl font-bold text-primary-600 mb-4">{score}/{questions.length * 10}</div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div className="bg-primary-600 h-3 rounded-full transition-all" style={{ width: `${percentage}%` }} />
          </div>
          <button onClick={resetQuiz} className="btn-primary">Play Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>Question {currentIndex + 1}/{questions.length}</span>
          <span>Score: {score}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="card p-8">
        <h2 className="text-2xl font-bold mb-6">{currentQuestion.text}</h2>
        
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = option === currentQuestion.correct;
            let bgColor = 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700';
            
            if (selectedAnswer) {
              if (isCorrect) bgColor = 'bg-green-100 dark:bg-green-900/30 border-green-500';
              else if (isSelected && !isCorrect) bgColor = 'bg-red-100 dark:bg-red-900/30 border-red-500';
            }
            
            return (
              <button
                key={idx}
                onClick={() => handleAnswer(option)}
                disabled={!!selectedAnswer}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${bgColor} border-gray-200 dark:border-gray-700`}
              >
                <span className="font-mono text-gray-400 mr-3">{String.fromCharCode(65 + idx)}.</span>
                {option}
                {selectedAnswer && isCorrect && <span className="float-right text-green-500">✓</span>}
                {selectedAnswer && isSelected && !isCorrect && <span className="float-right text-red-500">✗</span>}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">{currentQuestion.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};