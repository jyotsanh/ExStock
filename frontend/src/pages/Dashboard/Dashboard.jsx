
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  TrendingUpIcon, 
  BookOpenIcon, 
  MessageCircleIcon, 
  AwardIcon, 
  BarChartIcon,
  LockIcon,
  TrendingDownIcon,
  DollarSignIcon
} from 'lucide-react';

const Dashboard = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
 
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  
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
    { symbol: 'MSFT', price: 426.72, change: +0.87 },
    { symbol: 'AMZN', price: 182.15, change: -1.03 },
  ];

  const newsFeed = [
    {
      id: 1,
      headline: 'Fed Announces Interest Rate Decision',
      summary: 'Federal Reserve keeps rates unchanged as inflation data shows signs of cooling.',
      source: 'Financial Times',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      headline: 'Tech Stocks Rally on Strong Earnings',
      summary: 'Major technology companies report better-than-expected quarterly results, driving market gains.',
      source: 'Wall Street Journal',
      timestamp: '4 hours ago'
    },
    {
      id: 3,
      headline: 'Oil Prices Drop Amid Supply Concerns',
      summary: 'Crude oil futures fell by 2% following reports of increased production from major exporters.',
      source: 'Bloomberg',
      timestamp: '5 hours ago'
    },
    {
      id: 4,
      headline: 'Retail Sales Exceed Expectations',
      summary: 'Consumer spending increased by 0.7% last month, suggesting economic resilience despite inflation concerns.',
      source: 'CNBC',
      timestamp: '6 hours ago'
    }
  ];

  // Featured learning modules teaser
  const featuredModules = [
    {
      id: 1,
      title: "Introduction to Stock Trading",
      description: "Learn the basics of stock market investing and trading fundamentals.",
      difficulty: "Beginner",
      icon: BookOpenIcon
    },
    {
      id: 2,
      title: "Technical Analysis Fundamentals",
      description: "Master chart patterns and technical indicators to improve trading decisions.",
      difficulty: "Intermediate",
      icon: BarChartIcon
    },
    {
      id: 3,
      title: "Risk Management Strategies",
      description: "Discover effective techniques to protect your investments and minimize losses.",
      difficulty: "Advanced",
      icon: TrendingDownIcon
    }
  ];

  // Market trends section data
  const marketTrends = [
    { sector: "Technology", performance: "+2.3%", isPositive: true },
    { sector: "Healthcare", performance: "+1.5%", isPositive: true },
    { sector: "Energy", performance: "-0.8%", isPositive: false },
    { sector: "Finance", performance: "+0.4%", isPositive: true }
  ];

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex justify-center items-center w-full my-4">
  <h1 className="text-2xl font-bold text-[#00FF88]">NepStock Lab</h1>
</div>


      {/* Live Market Ticker - Enhanced with more stocks and better styling */}
      {/* <div className="bg-[#1A2D4D] rounded-lg p-4 shadow-lg w-full max-w-6xl h-32 mx-auto">
  <div className="flex flex-wrap justify-between">
    {marketData.map((stock, index) => (
      <div key={index} className="flex items-center space-x-2 px-4 py-1 border-r border-gray-700 last:border-r-0">
        <span className="font-medium">{stock.symbol}</span>
        <span className="text-gray-300">₨{stock.price.toFixed(2)}</span>
        <span className={`flex items-center ${stock.change >= 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
          {stock.change >= 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
          {Math.abs(stock.change).toFixed(2)}%
        </span>
      </div>
    ))}
  </div>
</div> */}
{/* <div className="bg-[#1A2D4D] rounded-lg p-4 shadow-lg overflow-x-auto w-full max-w-6xl h-32 mx-auto">
        <div className="flex justify-between min-w-max">
          {marketData.map((stock, index) => (
            <div key={index} className="flex items-center space-x- px-4 py-1 border-r border-gray-700 last:border-r-0">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-gray-300">${stock.price.toFixed(2)}</span>
              <span className={flex items-center ${
                stock.change >= 0 ? 'text-[#00FF88]' : 'text-red-500'
              }}>
                {stock.change >= 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
                {Math.abs(stock.change).toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div> */}

      {isLoggedIn ? (
        <>
          {/* Portfolio Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#1A2D4D] rounded-lg p-6 shadow-lg lg:col-span-2">
              <h2 className="text-lg font-medium mb-4">Your Portfolio</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Total Value</span>
                  <span className="text-xl font-bold">
                    R.s{portfolioData.totalValue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Cash Balance</span>
                  <span className="text-lg font-semibold">
                    R.s{portfolioData.cashBalance.toLocaleString()}
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

            {/* Quick Actions - Enhanced with better styling */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                to="/virtual-trading"
                className="flex flex-col items-center justify-center p-4 bg-[#1A2D4D] rounded-lg hover:bg-[#253D5D] transition"
              >
                <TrendingUpIcon size={24} className="mb-2 text-[#00FF88]" />
                <span className="font-medium">Start Trading</span>
              </Link>
              <Link
                to="/learning"
                className="flex flex-col items-center justify-center p-4 bg-[#1A2D4D] rounded-lg hover:bg-[#253D5D] transition"
              >
                <BookOpenIcon size={24} className="mb-2 text-[#00FF88]" />
                <span className="font-medium">Learn Now</span>
              </Link>
              <Link
                to="/ai-assistant"
                className="flex flex-col items-center justify-center p-4 bg-[#1A2D4D] rounded-lg hover:bg-[#253D5D] transition"
              >
                <MessageCircleIcon size={24} className="mb-2 text-[#00FF88]" />
                <span className="font-medium">AI Assistant</span>
              </Link>
              <Link
                to="/analytics"
                className="flex flex-col items-center justify-center p-4 bg-[#1A2D4D] rounded-lg hover:bg-[#253D5D] transition"
              >
                <BarChartIcon size={24} className="mb-2 text-[#00FF88]" />
                <span className="font-medium">Analytics</span>
              </Link>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Login CTA with feature preview */}
          <div className="bg-[#1A2D4D] p-6 rounded-lg text-center mb-6">
            <h2 className="text-lg font-medium mb-4">
              Sign in to access your portfolio and trading features
            </h2>
            <div className="flex justify-center space-x-4">
              <Link
                to="/login"
                className="px-6 py-2 bg-[#00FF88] text-[#0A1D3D] rounded-lg font-medium hover:bg-[#00E07B] transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-6 py-2 border border-[#00FF88] text-[#00FF88] rounded-lg font-medium hover:bg-[#00FF8820] transition"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Preview of Premium Features (visible but locked) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* AI Assistant Preview */}
            <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center">
                  <LockIcon size={24} className="mx-auto mb-2 text-[#00FF88]" />
                  <Link to="/login" className="text-[#00FF88] hover:underline">Login to Access</Link>
                </div>
              </div>
              <div className="flex items-center mb-3">
                <MessageCircleIcon size={20} className="text-[#00FF88] mr-2" />
                <h3 className="font-medium">AI Trading Assistant</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3">Ask questions about stocks, trading strategies, and get personalized investment advice.</p>
              <div className="bg-[#152238] p-3 rounded text-xs italic text-gray-400">
                "What stocks should I consider for a long-term technology investment?"
              </div>
            </div>
            
            {/* Virtual Trading Preview */}
            <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center">
                  <LockIcon size={24} className="mx-auto mb-2 text-[#00FF88]" />
                  <Link to="/login" className="text-[#00FF88] hover:underline">Login to Access</Link>
                </div>
              </div>
              <div className="flex items-center mb-3">
                <DollarSignIcon size={20} className="text-[#00FF88] mr-2" />
                <h3 className="font-medium">Virtual Trading</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3">Practice trading with Rs.10,000 of virtual money. Test strategies without risking real capital.</p>
              <div className="flex justify-between text-xs">
                <span>Portfolio Value</span>
                <span className="font-medium">Rs.10,000</span>
              </div>
            </div>
            
            {/* Learning Hub Preview */}
            <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-center">
                  <LockIcon size={24} className="mx-auto mb-2 text-[#00FF88]" />
                  <Link to="/login" className="text-[#00FF88] hover:underline">Login to Access</Link>
                </div>
              </div>
              <div className="flex items-center mb-3">
                <AwardIcon size={20} className="text-[#00FF88] mr-2" />
                <h3 className="font-medium">Learning Modules</h3>
              </div>
              <p className="text-sm text-gray-300 mb-3">Access 50+ interactive courses from beginner to advanced levels.</p>
              <div className="flex justify-between text-xs">
                <span>Progress</span>
                <span className="font-medium">Login to start</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Market Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-[#1A2D4D] rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-medium mb-4">Sector Performance</h2>
          <div className="space-y-3">
            {marketTrends.map((trend, index) => (
  <div key={index} className="flex justify-between items-center">
    <span className="text-gray-300">{trend.sector}</span>
    <span className={`font-medium ${trend.isPositive ? 'text-[#00FF88]' : 'text-red-500'}`}>
      {trend.performance}
    </span>
  </div>
))}
          </div>
        </div>

        {/* Featured Learning (preview for all, full access requires login) */}
        <div className="bg-[#1A2D4D] rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Featured Learning</h2>
            {!isLoggedIn && (
              <div className="flex items-center text-xs text-gray-300">
                <LockIcon size={14} className="mr-1" />
                <span>Login for full access</span>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {featuredModules.map((module, index) => (
              <div key={index} className="p-3 bg-[#152238] rounded-lg relative group overflow-hidden">
                {!isLoggedIn && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link to="/login" className="text-[#00FF88] hover:underline flex items-center">
                      <LockIcon size={14} className="mr-1" />
                      Login to Access
                    </Link>
                  </div>
                )}
                <div className="flex items-start">
                  <module.icon size={18} className="text-[#00FF88] mr-3 mt-1" />
                  <div>
                    <h3 className="font-medium text-sm">{module.title}</h3>
                    <p className="text-xs text-gray-300 mt-1">{module.description}</p>
                    <div className="mt-2">
                      <span className="inline-block bg-[#1A2D4D] text-xs px-2 py-1 rounded">
                        {module.difficulty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced News Section with more news items and better styling */}
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Latest Market News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsFeed.map((news) => (
            <div
              key={news.id}
              className="bg-[#1A2D4D] rounded-lg p-4 hover:bg-[#253D5D] transition cursor-pointer"
            >
              <h3 className="font-medium mb-2">{news.headline}</h3>
              <p className="text-gray-300 text-sm">{news.summary}</p>
              <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
                <span>{news.source}</span>
                <span>{news.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <Link to={isLoggedIn ? "/news" : "/login"} className="inline-flex items-center text-[#00FF88] hover:underline">
            {isLoggedIn ? "View All News" : "Login for More News"}
            {!isLoggedIn && <LockIcon size={14} className="ml-1" />}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;