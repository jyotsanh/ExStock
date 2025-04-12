import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StockTerminologyMatching = () => {
  const navigate = useNavigate();
  const termPairs = [
    { term: "Bull Market", definition: "A market condition where prices are rising" },
    { term: "Bear Market", definition: "A market condition where prices are falling" },
    { term: "Dividend", definition: "Company's profit distribution to shareholders" },
    { term: "IPO", definition: "Initial public offering of a private company" },
    { term: "ETF", definition: "Exchange-traded fund tracking an index" },
    { term: "Short Selling", definition: "Selling borrowed shares hoping to buy back cheaper" },
    { term: "Market Cap", definition: "Total value of a company's outstanding shares" },
    { term: "Blue Chip", definition: "Large, stable, well-established company" }
  ];

  const createCards = () => {
    const cards = termPairs.flatMap(pair => [
      { id: `${pair.term}-term`, content: pair.term, type: 'term' },
      { id: `${pair.term}-def`, content: pair.definition, type: 'definition' }
    ]);
    return shuffleArray([...cards]);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  useEffect(() => {
    setCards(createCards());
  }, []);

  useEffect(() => {
    if (matchedPairs.length === termPairs.length * 2) {
      setGameWon(true);
    }
  }, [matchedPairs]);

  const handleCardClick = (card) => {
    if (
      selectedCards.length === 2 ||
      card.type === selectedCards[0]?.type ||
      matchedPairs.includes(card.id)
    ) return;

    setSelectedCards([...selectedCards, card]);

    if (selectedCards.length === 1) {
      setMoves(moves + 1);
      const [firstCard] = selectedCards;
      
      const term = firstCard.type === 'term' ? firstCard : card;
      const definition = firstCard.type === 'definition' ? firstCard : card;
      
      if (term.content === definition.content.split(':')[0]) {
        setMatchedPairs([...matchedPairs, term.id, definition.id]);
      }

      setTimeout(() => setSelectedCards([]), 1000);
    }
  };

  const resetGame = () => {
    setCards(createCards());
    setSelectedCards([]);
    setMatchedPairs([]);
    setMoves(0);
    setGameWon(false);
  };

  const goBackToTerminology = () => {
    navigate('/stock-terminology');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-slate-800 min-h-screen text-white">
      {/* Back Button */}
      <button 
        onClick={goBackToTerminology}
        className="mb-6 px-4 py-2 flex items-center text-gray-400 hover:text-white transition-colors"
      >
        ← Back to Terminology
      </button>

      <h1 className="text-2xl font-bold mb-6 text-emerald-400">
        Stock Terminology Matching Game
      </h1>
      
      <div className="flex justify-between mb-6 items-center">
        <div className="text-gray-300">
          <span className="font-semibold">Moves:</span> {moves}
          <span className="mx-4">|</span>
          <span className="font-semibold">Matches:</span> {matchedPairs.length / 2} / {termPairs.length}
        </div>
        <button 
          onClick={resetGame}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          New Game
        </button>
      </div>

      {gameWon && (
        <div className="mb-6 p-4 bg-emerald-900/30 border border-emerald-500 rounded-lg text-center">
          <h2 className="text-xl font-bold text-emerald-400 mb-2">Congratulations! 🎉</h2>
          <p className="text-gray-300">You've matched all terms in {moves} moves!</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isSelected = selectedCards.some(c => c.id === card.id);
          const isMatched = matchedPairs.includes(card.id);
          
          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`h-32 flex items-center justify-center p-4 text-center cursor-pointer rounded-lg transition-all duration-300
                ${isMatched ? 'bg-emerald-900/30 border-2 border-emerald-500' : 
                   isSelected ? 'bg-slate-700 border-2 border-emerald-500' : 
                   'bg-slate-700 hover:bg-slate-600 border-2 border-slate-600'}
                ${isMatched ? 'cursor-default' : 'hover:shadow-md'}`}
            >
              <span className={`font-medium ${isMatched ? 'text-emerald-400' : 'text-gray-300'}`}>
                {card.content}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-slate-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-emerald-400">How to Play:</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-300">
          <li>Match stock market terms with their correct definitions</li>
          <li>Click a term card and then click its matching definition</li>
          <li>Correct matches will stay highlighted in green</li>
          <li>Complete all matches in the fewest moves possible</li>
        </ul>
      </div>
    </div>
  );
};

export default StockTerminologyMatching;