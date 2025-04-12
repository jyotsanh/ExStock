import React, { useState, useEffect } from 'react';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import LiveMarket from './livemarket';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('ws://192.168.100.88:8015/ws/v2'); // WebSocket URL

// Format currency to Nepali Rupees
const formatCurrency = (value) => `₨${value.toFixed(2)}`;

// User from localStorage
const user = JSON.parse(localStorage.getItem('user'));
const userId = user?.userId;

if (!userId) {
  console.error("User not logged in.");
}

const VirtualTrading = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('buy');
  const [coinBalance, setCoinBalance] = useState(0);
  const [message, setMessage] = useState('');

  // Setup WebSocket
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('stockData', (data) => {
      setStockData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Search stock with debounce
  useEffect(() => {
    if (searchQuery.trim()) {
      const timeout = setTimeout(() => {
        socket.emit('searchStock', { symbol: searchQuery });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery]);

  // Load balance from localStorage (only once)
  useEffect(() => {
    const storedBalance = localStorage.getItem('coinBalance');
    if (storedBalance) {
      setCoinBalance(parseFloat(storedBalance));
    } else {
      const initial = 100000; // default starting balance
      setCoinBalance(initial);
      localStorage.setItem('coinBalance', initial.toString());
    }
  }, []);

  const handleTrade = async () => {
    if (!stockData) {
      setMessage('Please search and select a stock first.');
      return;
    }

    const total = stockData.price * quantity;

    if (activeTab === 'buy' && total > coinBalance) {
      setMessage('Insufficient balance.');
      return;
    }

    try {
      await axios.post('http://192.168.100.81:3000/trade/save', {
        userId,
        symbol: stockData.symbol,
        action: activeTab,
        quantity,
        price: stockData.price,
      });

      const newBalance =
        activeTab === 'buy' ? coinBalance - total : coinBalance + total;

      setCoinBalance(newBalance);
      localStorage.setItem('coinBalance', newBalance.toFixed(2));

      setMessage(
        `Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ${quantity} ${stockData.symbol}`
      );
    } catch (err) {
      console.error(err);
      setMessage('Trade failed.');
    }
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h1 className="text-2xl font-bold mb-6">Virtual Trading</h1>
      <p className="text-sm text-gray-300 mb-2">Balance: {formatCurrency(coinBalance)}</p>
      <p className="text-sm text-yellow-400 mb-4">{message}</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        {/* Left Section */}
        <div className="flex flex-col space-y-6">
          {/* Search Input */}
          <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for stock symbols (e.g., AAPL)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
              />
              <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {/* Stock Info + Buy/Sell */}
          {stockData && (
            <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">{stockData.symbol}</h2>
                  <p className="text-gray-300 text-sm">{stockData.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">{formatCurrency(stockData.price)}</p>
                  <div className={`flex items-center justify-end ${stockData.change > 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                    {stockData.change > 0 ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
                    <span className="ml-1">
                      {formatCurrency(Math.abs(stockData.change))} ({Math.abs(stockData.changePercent)}%)
                    </span>
                  </div>
                </div>
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
                <label className="block text-gray-300 mb-2">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Total Cost</label>
                <div className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 text-white">
                  {formatCurrency(stockData.price * quantity)}
                </div>
              </div>

              <button
                onClick={handleTrade}
                className={`w-full py-3 rounded-lg font-medium text-[#0A1D3D] ${activeTab === 'buy' ? 'bg-[#00FF88] hover:bg-[#00E07B]' : 'bg-red-500 hover:bg-red-600'}`}
              >
                {activeTab === 'buy' ? 'Buy' : 'Sell'} {stockData.symbol}
              </button>
            </div>
          )}
        </div>

        {/* Right Section */}
        <div className="flex flex-col space-y-6">
          <LiveMarket />
        </div>
      </div>
    </div>
  );
};

export default VirtualTrading;
