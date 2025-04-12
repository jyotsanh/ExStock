import React, { useState, useEffect } from 'react';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import LiveMarket from './livemarket';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://192.168.100.53:3000'); // your backend socket server

const formatCurrency = (value) => {
  return `₨${value.toFixed(2)}`;
};

const userId = 'abc123'; // Use real user ID in production

const VirtualTrading = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stockData, setStockData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('buy');
  const [coinBalance, setCoinBalance] = useState(10000); // Initial 10k virtual coins
  const [message, setMessage] = useState('');

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

  useEffect(() => {
    if (searchQuery.trim()) {
      const timeout = setTimeout(() => {
        socket.emit('searchStock', { symbol: searchQuery });
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [searchQuery]);

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
      const res = await axios.post('http://192.168.100.53:3000/trade/save', {
        userId,
        symbol: stockData.symbol,
        action: activeTab,
        quantity,
        price: stockData.price,
      });

      setCoinBalance((prev) =>
        activeTab === 'buy' ? prev - total : prev + total
      );
      setMessage(`Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ${quantity} ${stockData.symbol}`);
    } catch (err) {
      console.error(err);
      setMessage('Trade failed.');
    }
  };

  const mockLeaderboard = [
    { rank: 1, username: 'trader123', value: 28750.45, returnPercent: 15.0 },
    { rank: 2, username: 'stockPro', value: 25980.30, returnPercent: 12.9 },
    { rank: 3, username: 'investorX', value: 24150.75, returnPercent: 10.6 },
  ];

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
          <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
            <h2 className="text-lg font-medium mb-4">Leaderboard</h2>
            <div className="overflow-x-auto max-h-48 overflow-y-scroll">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-2 text-left">Rank</th>
                    <th className="pb-2 text-left">Username</th>
                    <th className="pb-2 text-right">Value</th>
                    <th className="pb-2 text-right">Return</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((entry, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-3">{entry.rank}</td>
                      <td className="py-3">{entry.username}</td>
                      <td className="py-3 text-right">{formatCurrency(entry.value)}</td>
                      <td className={`py-3 text-right ${entry.returnPercent >= 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                        {entry.returnPercent.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTrading;
