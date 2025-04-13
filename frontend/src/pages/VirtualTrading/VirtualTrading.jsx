import React, { useState, useEffect } from 'react';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon, ChevronDownIcon } from 'lucide-react';
import LiveMarket from './livemarket';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('ws://192.168.100.88:8015/ws/v2'); // WebSocket URL

// Format currency to Nepali Rupees
const formatCurrency = (value) => `₨${value.toFixed(2)}`;

// Sample stock data for the pre-built form
const popularStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
];

const VirtualTrading = () => {
  const [step, setStep] = useState(1); // 1: Select stock, 2: Trade
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('buy');
  const [coinBalance, setCoinBalance] = useState(10000); // Start with 10k as requested
  const [message, setMessage] = useState('');
  const [portfolio, setPortfolio] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const storedBalance = localStorage.getItem('coinBalance');
    const storedPortfolio = localStorage.getItem('virtualPortfolio');

    if (storedBalance) {
      setCoinBalance(parseFloat(storedBalance));
    }

    if (storedPortfolio) {
      setPortfolio(JSON.parse(storedPortfolio));
    }

    // WebSocket connection
    socket.on('connect', () => console.log('Connected to WebSocket server'));
    socket.on('stockData', setStockData);

    return () => socket.disconnect();
  }, []);

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    socket.emit('searchStock', { symbol: stock.symbol });
    setStep(2);
  };

  const handleTrade = async () => {
    if (!stockData) {
      setMessage('Please select a stock first.');
      return;
    }

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      setMessage('Please enter a valid quantity (whole numbers only).');
      return;
    }

    const total = stockData.price * quantity;
    const symbol = stockData.symbol;

    if (activeTab === 'buy' && total > coinBalance) {
      setMessage('Insufficient balance for this purchase.');
      return;
    }

    if (activeTab === 'sell' && (!portfolio[symbol] || portfolio[symbol] < quantity)) {
      setMessage(`You don't have enough shares to sell. You own ${portfolio[symbol] || 0} shares.`);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://192.168.100.81:3000/trade/save', {
        userId: JSON.parse(localStorage.getItem('user'))?.userId,
        symbol,
        action: activeTab,
        quantity,
        price: stockData.price,
      });

      // Update balance and portfolio
      const newBalance = activeTab === 'buy' ? coinBalance - total : coinBalance + total;
      const newPortfolio = { ...portfolio };

      if (activeTab === 'buy') {
        newPortfolio[symbol] = (newPortfolio[symbol] || 0) + quantity;
      } else {
        newPortfolio[symbol] -= quantity;
        if (newPortfolio[symbol] <= 0) delete newPortfolio[symbol];
      }

      setCoinBalance(newBalance);
      setPortfolio(newPortfolio);
      localStorage.setItem('coinBalance', newBalance.toFixed(2));
      localStorage.setItem('virtualPortfolio', JSON.stringify(newPortfolio));

      setMessage(`Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ${quantity} shares of ${symbol}`);
    } catch (err) {
      console.error(err);
      setMessage('Trade failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMaxBuyable = () => {
    if (!stockData || stockData.price <= 0) return 0;
    return Math.floor(coinBalance / stockData.price);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-6">Virtual Trading</h1>
      
      {step === 1 ? (
        // Stock Selection Form
        <div className="bg-[#1A2D4D] rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Select a Stock to Trade</h2>
          <p className="text-gray-300 mb-6">You have {formatCurrency(coinBalance)} in your virtual account</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Popular Stocks</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock)}
                  className="bg-[#0A1D3D] hover:bg-[#0f2a5a] p-4 rounded-lg flex justify-between items-center transition-colors"
                >
                  <div>
                    <div className="font-bold">{stock.symbol}</div>
                    <div className="text-sm text-gray-400">{stock.name}</div>
                  </div>
                  <ChevronDownIcon className="text-gray-400" size={20} />
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Or search for other stocks..."
              className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
              onChange={(e) => {
                setSelectedStock({ symbol: e.target.value, name: '' });
                socket.emit('searchStock', { symbol: e.target.value });
              }}
            />
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      ) : (
        // Trading Interface
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Section */}
          <div className="flex flex-col space-y-6">
            {/* Stock Info + Buy/Sell */}
            <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
              <button 
                onClick={() => setStep(1)}
                className="text-blue-400 text-sm mb-4 flex items-center"
              >
                ← Back to stock selection
              </button>
              
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">{stockData?.symbol || selectedStock.symbol}</h2>
                  <p className="text-gray-300 text-sm">{stockData?.name || selectedStock.name}</p>
                </div>
                {stockData && (
                  <div className="text-right">
                    <p className="text-xl font-bold">{formatCurrency(stockData.price)}</p>
                    <div className={`flex items-center justify-end ${stockData.change > 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                      {stockData.change > 0 ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
                      <span className="ml-1">
                        {formatCurrency(Math.abs(stockData.change))} ({Math.abs(stockData.changePercent)}%)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex mb-4">
                <button
                  className={`flex-1 py-2 text-center border-b-2 ${activeTab === 'buy' ? 'border-[#00FF88] text-[#00FF88]' : 'border-gray-700 text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('buy')}
                >
                  Buy
                </button>
                <button
                  className={`flex-1 py-2 text-center border-b-2 ${activeTab === 'sell' ? 'border-red-500 text-red-500' : 'border-gray-700 text-gray-400 hover:text-white'}`}
                  onClick={() => setActiveTab('sell')}
                >
                  Sell
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  Quantity
                  {activeTab === 'buy' && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Max: {calculateMaxBuyable()})
                    </span>
                  )}
                  {activeTab === 'sell' && portfolio[selectedStock.symbol] && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Owned: {portfolio[selectedStock.symbol]})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  min="1"
                  max={activeTab === 'buy' ? calculateMaxBuyable() : portfolio[selectedStock.symbol] || 0}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Total {activeTab === 'buy' ? 'Cost' : 'Value'}</label>
                <div className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 text-white">
                  {stockData ? formatCurrency(stockData.price * quantity) : 'Loading...'}
                </div>
              </div>

              <button
                onClick={handleTrade}
                disabled={isLoading || !stockData}
                className={`w-full py-3 rounded-lg font-medium text-[#0A1D3D] flex items-center justify-center ${
                  activeTab === 'buy' 
                    ? 'bg-[#00FF88] hover:bg-[#00E07B]' 
                    : 'bg-red-500 hover:bg-red-600'
                } ${isLoading ? 'opacity-70' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${quantity} ${selectedStock.symbol}`
                )}
              </button>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex flex-col space-y-6">
            <LiveMarket />
            
            {/* Portfolio Summary */}
            {Object.keys(portfolio).length > 0 && (
              <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
                <h2 className="text-lg font-bold mb-4">Your Portfolio</h2>
                <div className="space-y-3">
                  {Object.entries(portfolio).map(([symbol, shares]) => (
                    <div key={symbol} className="flex justify-between items-center">
                      <span className="font-medium">{symbol}</span>
                      <span>{shares} shares</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('Success') ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default VirtualTrading;