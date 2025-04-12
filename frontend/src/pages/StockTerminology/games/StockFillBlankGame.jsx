import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StockFillBlankGame = () => {
  const navigate = useNavigate();
  
  // Stock market fill-in-the-blank questions
  const stockQuestions = [
    {
      id: 1,
      sentence: "A ______ market is characterized by rising prices and investor optimism.",
      answer: "bull",
      hint: "Opposite of bear"
    },
    {
      id: 2,
      sentence: "The ______ ratio measures a company's current share price relative to its earnings per share.",
      answer: "P/E",
      hint: "Price-to-______ ratio"
    },
    {
      id: 3,
      sentence: "______ refers to the total value of a company's outstanding shares.",
      answer: "Market Cap",
      hint: "Short for Market Capitalization"
    },
    {
      id: 4,
      sentence: "A ______ order allows buying/selling at a specific price or better.",
      answer: "limit",
      hint: "Opposite of market order"
    },
    {
      id: 5,
      sentence: "______ trading refers to buying and selling within the same trading day.",
      answer: "Day",
      hint: "Opposite of long-term investing"
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Reset state for new question
  useEffect(() => {
    setUserAnswer("");
    setFeedback("");
    setShowHint(false);
  }, [currentQuestionIndex]);

  // Check if answer is correct
  const checkAnswer = () => {
    const correctAnswer = stockQuestions[currentQuestionIndex].answer.toLowerCase();
    const userAttempt = userAnswer.trim().toLowerCase();

    if (userAttempt === "") {
      setFeedback("Please enter an answer!");
      return;
    }

    if (userAttempt === correctAnswer) {
      setFeedback("Correct! 🎉");
      setScore(prev => prev + 1);
    } else {
      setFeedback(`Incorrect 😞 Correct answer: ${stockQuestions[currentQuestionIndex].answer}`);
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < stockQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameCompleted(true);
      
      // In a real app, you would update the score in the backend here
      // For now, we'll just simulate this with console logs
      console.log("Game completed with score:", score);
      
      // You could add code here to update the progress in localStorage or a backend
      // For example:
      // localStorage.setItem('memoryGamesCompleted', parseInt(localStorage.getItem('memoryGamesCompleted') || '0') + 1);
    }
  };

  // Restart game
  const resetGame = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setGameCompleted(false);
    setUserAnswer("");
    setFeedback("");
  };
  const goBackToTerminology = () => {
    navigate('/stock-terminology');
  };

 
   
  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <button
        onClick={() => navigate('/stock-terminology')}
        className="mb-6 px-4 py-2 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        <span className="mr-2">←</span> Back to Stock Terminology
      </button>
    
      <h1 className="text-2xl font-semibold mb-6">Stock Market Fill-in-the-Blanks</h1>
      
      {!gameCompleted ? (
        <div className="bg-slate-800 rounded-lg shadow-md p-6 mb-6">
          {/* Progress */}
          <div className="flex justify-between mb-6">
            <p>Question {currentQuestionIndex + 1} of {stockQuestions.length}</p>
            <p>Score: {score}/{stockQuestions.length}</p>
          </div>

          {/* Question */}
          <div className="mb-6">
            <p className="text-lg mb-4">
              {stockQuestions[currentQuestionIndex].sentence}
            </p>
            
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer"
                className="flex-1 p-2 border bg-slate-700 text-white border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
              />
              <button
                onClick={checkAnswer}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Check
              </button>
            </div>

            {/* Hint */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-gray-400 hover:text-gray-300"
            >
              {showHint ? "Hide Hint" : "Show Hint"}
            </button>
            {showHint && (
              <p className="mt-2 text-sm text-gray-400">
                Hint: {stockQuestions[currentQuestionIndex].hint}
              </p>
            )}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-4 rounded-lg ${
              feedback.startsWith("Correct") ? "bg-green-900" : "bg-red-900"
            }`}>
              <p className={feedback.startsWith("Correct") ? "text-green-300" : "text-red-300"}>
                {feedback}
              </p>
              <button
                onClick={handleNextQuestion}
                className="mt-4 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Completed Screen */
        <div className="bg-slate-800 rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Game Complete! 🏆</h2>
          <p className="text-xl mb-6">Final Score: {score}/{stockQuestions.length}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate('/stock-terminology')}
            >
              Back to Games
            </button>
          </div>
        </div>
      )}

      {/* Game Tips */}
      <div className="mt-6 p-4 bg-slate-800 rounded-lg">
        <p className="font-semibold mb-2">💡 Tips:</p>
        <ul className="list-disc pl-6">
          <li>Answers are case-insensitive</li>
          <li>Use the hint if you're stuck</li>
          <li>Try to recall terms from previous lessons</li>
        </ul>
      </div>
    </div>
  );
};

export default StockFillBlankGame;