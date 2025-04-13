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
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Fun with Stock</h1>
        </div>

        <p className="mb-8 text-gray-300 text-lg max-w-3xl">
          Learn the essential terms and concepts used in stock market trading through interactive games.
        </p>

        {/* Game Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* MCQ Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500 hover:shadow-emerald-900/20 hover:transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-white">MCQ's</h2>
            <p className="text-gray-300 mb-6 h-20">Learn stock market terms with interactive multiple choice questions.</p>
            <button
              onClick={() => navigateToGame('flashcards')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-colors shadow-md flex items-center justify-center font-medium"
            >
              <span>Start Playing</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Matching Game Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500 hover:shadow-emerald-900/20 hover:transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-white">Term Matching</h2>
            <p className="text-gray-300 mb-6 h-20">Match stock terms with their correct definitions in this interactive memory game.</p>
            <button
              onClick={() => navigateToGame('matching')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-colors shadow-md flex items-center justify-center font-medium"
            >
              <span>Play Game</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          {/* Memory Game Card */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 shadow-lg border-l-4 border-emerald-500 hover:shadow-emerald-900/20 hover:transform hover:scale-105 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-4 text-white">Market Fill Memory</h2>
            <p className="text-gray-300 mb-6 h-20">Memory game with stock market terms to fill in the blanks and test your knowledge.</p>
            <button
              onClick={() => navigateToGame('memory')}
              className="w-full px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl hover:from-emerald-500 hover:to-teal-500 transition-colors shadow-md flex items-center justify-center font-medium"
            >
              <span>Play Game</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Section - Uncomment if needed */}
        {/* <div className="mt-12 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Your Learning Progress</h2>
            <button 
              onClick={handleRefresh} 
              className="text-emerald-400 hover:text-emerald-300 flex items-center transition-colors p-2 hover:bg-slate-700 rounded-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
              <div className="mb-3 text-sm font-medium text-gray-300">Flashcards Completed</div>
              <div className="text-3xl font-bold mb-3 text-white flex items-baseline">
                {flashcardsCompleted} 
                <span className="text-gray-400 text-sm ml-1">/ 50</span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(flashcardsCompleted/50)*100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
              <div className="mb-3 text-sm font-medium text-gray-300">Matching Games</div>
              <div className="text-3xl font-bold mb-3 text-white flex items-baseline">
                {matchingGamesCompleted} 
                <span className="text-gray-400 text-sm ml-1">/ 20</span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(matchingGamesCompleted/20)*100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700/50">
              <div className="mb-3 text-sm font-medium text-gray-300">Memory Games</div>
              <div className="text-3xl font-bold mb-3 text-white flex items-baseline">
                {memoryGamesCompleted}
                <span className="text-gray-400 text-sm ml-1">/ 15</span>
              </div>
              <div className="w-full bg-gray-700/30 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${(memoryGamesCompleted/15)*100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default StockTerminology;