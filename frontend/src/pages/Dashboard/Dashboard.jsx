// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, BookOpenIcon } from 'lucide-react';

const Dashboard = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  // Fix: Provide a string default value for JSON.parse
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Mock data
  const portfolioData = {
    totalValue: 15420.75,
    cashBalance: 4250.30,
    profitLoss: 5.8,
    isProfit: true,
  };

  const marketData = [
    { symbol: 'AAPL', price: 189.84, change: +1.23 },
    { symbol: 'GOOGL', price: 2781.34, change: -0.45 },
    { symbol: 'TSLA', price: 248.50, change: +3.12 },
  ];

  const newsFeed = [
    {
      id: 1,
      headline: 'Fed Announces Interest Rate Decision',
      summary: 'Federal Reserve keeps rates unchanged...',
      source: 'Financial Times',
    },
    // Add more news items
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <h1 className="text-2xl font-bold">Market Overview</h1>

      {/* Live Market Ticker */}
      <div className="bg-[#1A2D4D] rounded-lg p-4 shadow-lg">
        <div className="flex justify-between">
          {marketData.map((stock, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-gray-300">${stock.price.toFixed(2)}</span>
              <span className={`flex items-center ${
                stock.change >= 0 ? 'text-[#00FF88]' : 'text-red-500'
              }`}>
                {stock.change >= 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
                {Math.abs(stock.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {isLoggedIn ? (
        <>
          {/* Portfolio Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#1A2D4D] rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-medium mb-4">Your Portfolio</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Value</span>
                  <span className="text-xl font-bold">
                    ${portfolioData.totalValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">24h Change</span>
                  <div className={`flex items-center ${
                    portfolioData.isProfit ? 'text-[#00FF88]' : 'text-red-500'
                  }`}>
                    {portfolioData.isProfit ? (
                      <ArrowUpIcon size={16} />
                    ) : (
                      <ArrowDownIcon size={16} />
                    )}
                    <span className="text-lg font-semibold ml-1">
                      {portfolioData.profitLoss}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/virtual-trading"
                className="flex flex-col items-center justify-center p-4 bg-[#1A2D4D] rounded-lg hover:bg-[#253D5D] transition"
              >
                <TrendingUpIcon size={24} className="mb-2" />
                <span>Start Trading</span>
              </Link>
              <Link
                to="/learning-modules"
                className="flex flex-col items-center justify-center p-4 bg-[#1A2D4D] rounded-lg hover:bg-[#253D5D] transition"
              >
                <BookOpenIcon size={24} className="mb-2" />
                <span>Learn Now</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-[#1A2D4D] p-6 rounded-lg text-center">
          <h2 className="text-lg font-medium mb-4">
            Sign in to access your portfolio and trading features
          </h2>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 bg-[#00FF88] text-[#0A1D3D] rounded-lg font-medium hover:bg-[#00E07B]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 border border-[#00FF88] text-[#00FF88] rounded-lg font-medium hover:bg-[#00FF8820]"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* News Section (Visible to all) */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Latest Market News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsFeed.map((news) => (
            <div
              key={news.id}
              className="bg-[#1A2D4D] rounded-lg p-4 hover:bg-[#253D5D] transition"
            >
              <h3 className="font-medium mb-2">{news.headline}</h3>
              <p className="text-gray-300 text-sm">{news.summary}</p>
              <div className="mt-3 text-xs text-gray-400">{news.source}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;