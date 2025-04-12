import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StockTerminology = () => {
  const navigate = useNavigate();
  const [flashcardsCompleted, setFlashcardsCompleted] = useState(28);
  const [matchingGamesCompleted, setMatchingGamesCompleted] = useState(12);
  const [memoryGamesCompleted, setMemoryGamesCompleted] = useState(8);

  const navigateToGame = (game) => {
    navigate(`/stock-terminology/${game}`);
  };

  const handleRefresh = () => {
    console.log("Refreshing progress data...");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Fun with Stock</h1>
      </div>

      <p className="mb-6 text-white">
        Learn the essential terms and concepts used in stock market trading through interactive games.
      </p>

      {/* Back to Learning Modules button */}
      {/* <button 
        onClick={() => navigate('/learning-modules')}
        className="mb-6 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
      >
        ← Back to Learning Modules
      </button> */}

      {/* Game Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* MCQ Card */}
        <div className="bg-slate-800 rounded-xl p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-white">MCQ's</h2>
          <p className="text-gray-200 mb-4">Learn stock market terms with MCQ's.</p>
          <button
            onClick={() => navigateToGame('flashcards')}
            className="w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Start Playing
          </button>
        </div>

        {/* Matching Game Card */}
        <div className="bg-slate-800 rounded-xl p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-white">Term Matching</h2>
          <p className="text-gray-200 mb-4">Match stock terms with their correct definitions in this memory game.</p>
          <button
            onClick={() => navigateToGame('matching')}
            className="w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Play Game
          </button>
        </div>

        {/* Memory Game Card */}
        <div className="bg-slate-800 rounded-xl p-6 border-l-4 border-emerald-500 hover:shadow-md transition-shadow">
          <h2 className="text-xl font-semibold mb-3 text-white">Market Fill Memory</h2>
          <p className="text-gray-200 mb-4">Memory game with stock market to fill in the blanks.</p>
          <button
            onClick={() => navigateToGame('memory')}
            className="w-full px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Play Game
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mt-8 bg-slate-800 rounded-xl p-6 shadow-sm text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Learning Progress</h2>
          <button onClick={handleRefresh} className="text-emerald-400 hover:text-emerald-300 flex items-center">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-lg p-4">
            <div className="mb-2 text-sm font-medium text-gray-200">Flashcards Completed</div>
            <div className="text-2xl font-bold mb-2 text-white">{flashcardsCompleted} / 50</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${(flashcardsCompleted/50)*100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="mb-2 text-sm font-medium text-gray-200">Matching Games</div>
            <div className="text-2xl font-bold mb-2 text-white">{matchingGamesCompleted} / 20</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${(matchingGamesCompleted/20)*100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-lg p-4">
            <div className="mb-2 text-sm font-medium text-gray-200">Memory Games</div>
            <div className="text-2xl font-bold mb-2 text-white">{memoryGamesCompleted} / 15</div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-emerald-500 h-2 rounded-full" 
                style={{ width: `${(memoryGamesCompleted/15)*100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockTerminology;