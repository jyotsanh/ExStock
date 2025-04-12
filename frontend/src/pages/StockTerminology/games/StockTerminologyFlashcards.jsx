import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StockTerminologyFlashcards = () => {
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([
    { 
      id: 1, 
      question: "What is a Bull Market?",
      options: [
        "Market with rising prices",
        "Market with falling prices",
        "Market with stable prices",
        "Market for cattle trading"
      ],
      correctAnswer: 0,
      learned: false
    },
    { 
      id: 2, 
      question: "What does P/E Ratio stand for?",
      options: [
        "Price-to-Earnings ratio",
        "Profit-to-Expense ratio",
        "Public-Equity ratio",
        "Personal-Expense ratio"
      ],
      correctAnswer: 0,
      learned: false
    }
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [hearts, setHearts] = useState(5);
  const [maxHearts] = useState(5);
  const [nextHeartRefill, setNextHeartRefill] = useState(null);
  const [progress, setProgress] = useState(0);

  // Initialize from localStorage
  useEffect(() => {
    const savedHearts = localStorage.getItem('hearts');
    const savedRefill = localStorage.getItem('nextHeartRefill');
    
    if (savedHearts) setHearts(JSON.parse(savedHearts));
    if (savedRefill) setNextHeartRefill(new Date(savedRefill));
  }, []);

  // Heart refill system
  useEffect(() => {
    const checkRefill = () => {
      const now = new Date();
      if (!nextHeartRefill || now >= nextHeartRefill) {
        const newRefill = new Date();
        newRefill.setHours(newRefill.getHours() + 24);
        setHearts(maxHearts);
        setNextHeartRefill(newRefill);
        localStorage.setItem('hearts', JSON.stringify(maxHearts));
        localStorage.setItem('nextHeartRefill', newRefill.toISOString());
      }
    };

    const interval = setInterval(checkRefill, 1000);
    return () => clearInterval(interval);
  }, [nextHeartRefill, maxHearts]);

  // Progress calculation
  useEffect(() => {
    const learnedCount = flashcards.filter(card => card.learned).length;
    setProgress((learnedCount / flashcards.length) * 100);
  }, [flashcards]);

  const handleAnswer = (selectedIndex) => {
    if (showResult || hearts <= 0) return;

    setSelectedAnswer(selectedIndex);
    setShowResult(true);

    const isCorrect = selectedIndex === flashcards[currentCardIndex].correctAnswer;

    if (!isCorrect) {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      localStorage.setItem('hearts', JSON.stringify(newHearts));
    }

    if (isCorrect) {
      const updatedCards = flashcards.map((card, index) => 
        index === currentCardIndex ? {...card, learned: true} : card
      );
      setFlashcards(updatedCards);
    }
  };

  const nextCard = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentCardIndex(prev => (prev + 1) % flashcards.length);
  };

  const formatTimeRemaining = () => {
    if (!nextHeartRefill) return 'Loading...';
    const now = new Date();
    const diffMs = nextHeartRefill - now;
    
    if (diffMs <= 0) return 'Refilling...';
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const goBack = () => {
    navigate('/stock-terminology');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-slate-800 min-h-screen text-white">
      {/* Back Button */}
      <button 
        onClick={goBack}
        className="mb-6 px-4 py-2 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        ← Back to Terminology
      </button>

      {/* Hearts Display */}
      <div className="mb-6 bg-slate-700 p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {Array.from({ length: maxHearts }).map((_, index) => (
              <span key={index} className="text-2xl mr-1">
                {index < hearts ? '❤️' : '🖤'}
              </span>
            ))}
          </div>
          {hearts < maxHearts && (
            <div className="text-sm text-emerald-400">
              Next refill: {formatTimeRemaining()}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-1 text-gray-200">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2.5">
          <div 
            className="bg-emerald-500 h-2.5 rounded-full" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-700 rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {flashcards[currentCardIndex].question}
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          {flashcards[currentCardIndex].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult || hearts <= 0}
              className={`p-3 text-left rounded-lg transition-all
                ${selectedAnswer === index 
                  ? index === flashcards[currentCardIndex].correctAnswer 
                    ? 'bg-emerald-700 border-2 border-emerald-500 text-white'
                    : 'bg-red-700 border-2 border-red-500 text-white'
                  : 'bg-slate-600 hover:bg-slate-500 text-white'}
                ${showResult && index === flashcards[currentCardIndex].correctAnswer 
                  ? 'border-2 border-emerald-500' 
                  : ''}
                `}
            >
              {option}
            </button>
          ))}
        </div>

        {showResult && (
          <div className="mt-4">
            <button
              onClick={nextCard}
              className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Next Question →
            </button>
          </div>
        )}
      </div>

      {/* Card Counter */}
      <div className="text-center mb-6 text-gray-300">
        Question {currentCardIndex + 1} of {flashcards.length}
      </div>

      {/* Out of hearts message */}
      {hearts <= 0 && (
        <div className="mt-6 p-4 bg-red-800/30 border border-red-500 rounded-lg text-center">
          <p className="text-red-300">Come back after {formatTimeRemaining()} to refill hearts!</p>
        </div>
      )}
    </div>
  );
};

export default StockTerminologyFlashcards;