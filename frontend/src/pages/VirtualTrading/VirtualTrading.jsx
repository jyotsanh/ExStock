import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon, ChevronDownIcon } from 'lucide-react';
import LiveMarket from './livemarket';
import axios from 'axios';
import io from 'socket.io-client';

// Initialize Socket.IO with proper configuration
const ws = new WebSocket("ws://192.168.100.88:8015/ws/v2");

const formatCurrency = (value) => 
  `₨${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const popularNepseStocks = [
  { symbol: 'NIC', name: 'NIC Asia Bank' },
  { symbol: 'NBL', name: 'Nepal Bank Limited' },
  { symbol: 'SCB', name: 'Standard Chartered Bank' },
  { symbol: 'NTC', name: 'Nepal Telecom' },
  { symbol: 'NIFRA', name: 'Nepal Infrastructure Bank' },
  { symbol: 'CBL', name: 'Citizens Bank' },
];

const VirtualTrading = () => {
  const [step, setStep] = useState(1);
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockData, setStockData] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('buy');
  const [coinBalance, setCoinBalance] = useState(10000);
  const [message, setMessage] = useState('');
  const [portfolio, setPortfolio] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingStock, setIsFetchingStock] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);

  // Memoized values
  const totalValue = useMemo(() => stockData?.price * quantity || 0, [stockData, quantity]);
  const maxBuyable = useMemo(() => 
    Math.floor(coinBalance / (stockData?.price || 1)), [coinBalance, stockData]);
  const ownedShares = useMemo(() => 
    portfolio[selectedStock?.symbol] || 0, [portfolio, selectedStock]);

  // WebSocket management
  useEffect(() => {
    const handleConnect = () => {
      setSocketConnected(true);
      socket.emit('subscribe', { market: 'nepse' });
    };

    const handleDisconnect = () => setSocketConnected(false);

    const handleNepseData = (data) => {
      if (data.symbol === selectedStock?.symbol) {
        setStockData(data);
        setIsFetchingStock(false);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('nepseData', handleNepseData);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('nepseData', handleNepseData);
      socket.disconnect();
    };
  }, [selectedStock]);

  // Load initial data
  useEffect(() => {
    const savedBalance = localStorage.getItem('coinBalance');
    const savedPortfolio = localStorage.getItem('virtualPortfolio');
    
    if (savedBalance) setCoinBalance(parseFloat(savedBalance));
    if (savedPortfolio) setPortfolio(JSON.parse(savedPortfolio));
  }, []);

  const handleStockSelect = useCallback((stock) => {
    setSelectedStock(stock);
    setIsFetchingStock(true);
    if (socketConnected) {
      socket.emit('getNepseStock', { symbol: stock.symbol });
    }
    setStep(2);
  }, [socketConnected]);

  const handleTrade = useCallback(async () => {
    if (!stockData || !selectedStock) return;

    const { symbol, price } = stockData;
    const total = price * quantity;

    // Validation
    if (quantity < 1 || !Number.isInteger(quantity)) {
      setMessage('कृपया वैध मात्रा प्रविष्ट गर्नुहोस्');
      return;
    }

    if (activeTab === 'buy' && total > coinBalance) {
      setMessage('तपाईंको खातामा पर्याप्त रकम छैन');
      return;
    }

    if (activeTab === 'sell' && ownedShares < quantity) {
      setMessage(`तपाईंसँग पर्याप्त शेयर छैन। तपाईंसँग ${ownedShares} शेयर छन्`);
      return;
    }

    setIsLoading(true);
    try {
      await axios.post('http://192.168.100.81:3000/trade/save', {
        userId: JSON.parse(localStorage.getItem('user'))?.userId,
        symbol,
        action: activeTab,
        quantity,
        price,
        market: 'nepse'
      });

      // Update state
      const newBalance = activeTab === 'buy' ? coinBalance - total : coinBalance + total;
      const newPortfolio = { ...portfolio };

      if (activeTab === 'buy') {
        newPortfolio[symbol] = (newPortfolio[symbol] || 0) + quantity;
      } else {
        newPortfolio[symbol] = Math.max(0, (newPortfolio[symbol] || 0) - quantity);
        if (newPortfolio[symbol] <= 0) delete newPortfolio[symbol];
      }

      // Update state and storage
      setCoinBalance(newBalance);
      setPortfolio(newPortfolio);
      localStorage.setItem('coinBalance', newBalance.toFixed(2));
      localStorage.setItem('virtualPortfolio', JSON.stringify(newPortfolio));

      setMessage(`सफलतापूर्वक ${quantity} ${symbol} को शेयर ${activeTab === 'buy' ? 'किन्नुभयो' : 'बेच्नुभयो'}`);
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Trade error:', error);
      setMessage('लेनदेन असफल भयो। कृपया पुन: प्रयास गर्नुहोस्');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, coinBalance, portfolio, quantity, stockData, selectedStock, ownedShares]);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value) || 0;
    const max = activeTab === 'buy' ? maxBuyable : ownedShares;
    const clampedValue = Math.min(Math.max(1, value), max);
    setQuantity(clampedValue);
  }, [activeTab, maxBuyable, ownedShares]);

  return (
    <div className="flex flex-col h-full p-4">
      {/* Connection Status */}
      {!socketConnected && (
        <div className="bg-yellow-500 text-white p-2 mb-4 rounded text-center animate-pulse">
          NEPSE सर्भरसँग जडान हुँदैछ...
        </div>
      )}

      {/* Balance Header */}
      <div className="bg-[#1A2D4D] rounded-lg p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">NEPSE Virtual Trading</h1>
        <div className="text-right">
          <p className="text-sm text-gray-300">भर्चुअल ब्यालेन्स</p>
          <p className="text-xl font-bold text-[#00FF88]">{formatCurrency(coinBalance)}</p>
        </div>
      </div>

      {/* Main Content */}
      {step === 1 ? (
        <div className="bg-[#1A2D4D] rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">व्यापार गर्न स्टक चयन गर्नुहोस्</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">लोकप्रिय NEPSE स्टकहरू</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularNepseStocks.map((stock) => (
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
              placeholder="अन्य NEPSE स्टकहरू खोज्नुहोस्..."
              className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
              onChange={(e) => {
                const symbol = e.target.value.toUpperCase();
                setSelectedStock({ symbol, name: '' });
                socket.emit('searchNepseStock', { symbol });
              }}
            />
            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Left Panel */}
          <div className="flex flex-col space-y-6">
            <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
              <button 
                onClick={() => setStep(1)}
                className="text-blue-400 text-sm mb-4 flex items-center hover:text-blue-300"
              >
                ← स्टक चयनमा फिर्ता जानुहोस्
              </button>

              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">{selectedStock?.symbol}</h2>
                  <p className="text-gray-300 text-sm">{selectedStock?.name || 'लोड हुँदैछ...'}</p>
                </div>
                <div className="text-right">
                  {stockData ? (
                    <>
                      <p className="text-xl font-bold">{formatCurrency(stockData.price)}</p>
                      <div className={`flex items-center justify-end ${
                        stockData.change > 0 ? 'text-[#00FF88]' : 'text-red-500'
                      }`}>
                        {stockData.change > 0 ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
                        <span className="ml-1">
                          {formatCurrency(Math.abs(stockData.change))} ({Math.abs(stockData.changePercent)}%)
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="animate-pulse text-gray-400">
                      <p className="text-xl font-bold">--</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Trade Controls */}
              <div className="flex mb-4">
                <button
                  className={`flex-1 py-2 text-center border-b-2 ${
                    activeTab === 'buy' 
                      ? 'border-[#00FF88] text-[#00FF88]' 
                      : 'border-gray-700 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('buy')}
                >
                  किन्नुहोस्
                </button>
                <button
                  className={`flex-1 py-2 text-center border-b-2 ${
                    activeTab === 'sell' 
                      ? 'border-red-500 text-red-500' 
                      : 'border-gray-700 text-gray-400 hover:text-white'
                  }`}
                  onClick={() => setActiveTab('sell')}
                >
                  बेच्नुहोस्
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  मात्रा
                  <span className="text-xs text-gray-500 ml-2">
                    ({activeTab === 'buy' ? `अधिकतम: ${maxBuyable}` : `उपलब्ध: ${ownedShares}`})
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={activeTab === 'buy' ? maxBuyable : ownedShares}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">
                  कुल {activeTab === 'buy' ? 'लागत' : 'मूल्य'}
                </label>
                <div className="w-full bg-[#0A1D3D] border border-gray-700 rounded-lg px-4 py-2 text-white">
                  {stockData ? formatCurrency(totalValue) : '--'}
                </div>
              </div>

              <button
                onClick={handleTrade}
                disabled={isLoading || !stockData}
                className={`w-full py-3 rounded-lg font-medium text-[#0A1D3D] flex items-center justify-center ${
                  activeTab === 'buy' 
                    ? 'bg-[#00FF88] hover:bg-[#00E07B]' 
                    : 'bg-red-500 hover:bg-red-600'
                } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    प्रक्रिया हुँदैछ...
                  </>
                ) : (
                  `${activeTab === 'buy' ? 'किन्नुहोस्' : 'बेच्नुहोस्'} ${quantity} ${selectedStock.symbol}`
                )}
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="flex flex-col space-y-6">
            <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg h-full">
              {isFetchingStock ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-pulse text-gray-400">NEPSE डाटा लोड हुँदैछ...</div>
                </div>
              ) : (
                <LiveMarket 
                  selectedStock={selectedStock?.symbol} 
                  market="nepse"
                  // onDataLoad={() => setIsFetchingStock(true)}
                />
              )}
            </div>

            {Object.keys(portfolio).length > 0 && (
              <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
                <h2 className="text-lg font-bold mb-4">तपाईंको पोर्टफोलियो</h2>
                <div className="space-y-3">
                  {Object.entries(portfolio).map(([symbol, shares]) => (
                    <div key={symbol} className="flex justify-between items-center">
                      <span className="font-medium">{symbol}</span>
                      <span>{shares} शेयर</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Messages */}
      {message && (
        <div className={`mt-4 p-3 rounded-lg ${
          message.includes('सफलतापूर्वक') 
            ? 'bg-green-900 text-green-300' 
            : 'bg-yellow-900 text-yellow-300'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default VirtualTrading;