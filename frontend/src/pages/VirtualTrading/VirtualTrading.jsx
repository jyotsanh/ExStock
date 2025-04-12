import React, { useState } from 'react';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon } from 'lucide-react';
import LiveMarket from './livemarket';

// Utility function to format currency in Nepali Rupees
const formatCurrency = (value) => {
  return `₨${value.toFixed(2)}`;
};

const VirtualTrading = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('buy');

  const mockStockData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.50,
    change: 2.75,
    changePercent: 1.47,
  };

  const mockLeaderboard = [
    { rank: 1, username: 'trader123', value: 28750.45, returnPercent: 15.0 },
    { rank: 2, username: 'stockPro', value: 25980.30, returnPercent: 12.9 },
    { rank: 3, username: 'investorX', value: 24150.75, returnPercent: 10.6 },
    { rank: 4, username: 'marketGuru', value: 22340.60, returnPercent: 7.7 },
    { rank: 5, username: 'bullRun', value: 21090.15, returnPercent: 5.5 },
  ];

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-6">Virtual Trading</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col space-y-6">
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

          <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">{mockStockData.symbol}</h2>
                <p className="text-gray-300 text-sm">{mockStockData.name}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">{formatCurrency(mockStockData.price)}</p>
                <div className={`flex items-center justify-end ${mockStockData.change > 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                  {mockStockData.change > 0 ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
                  <span className="ml-1">
                    {formatCurrency(Math.abs(mockStockData.change))} ({Math.abs(mockStockData.changePercent)}%)
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
                {formatCurrency(mockStockData.price * quantity)}
              </div>
            </div>

            <button
              className={`w-full py-3 rounded-lg font-medium text-[#0A1D3D] ${activeTab === 'buy' ? 'bg-[#00FF88] hover:bg-[#00E07B]' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {activeTab === 'buy' ? 'Buy' : 'Sell'} {mockStockData.symbol}
            </button>
          </div>
        </div>

        <div className="flex flex-col space-y-6">
          {/* Live Market Component */}
          <LiveMarket />

          {/* Leaderboard */}
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
