import React, { useState, useEffect, useRef } from 'react';
import { SearchIcon, TrendingUpIcon, TrendingDownIcon, RefreshCwIcon } from 'lucide-react';

const VirtualTrading = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('buy');
  const [holdings, setHoldings] = useState([]); // This is where we'll store the live holdings
  const ws = useRef(null);

  // Mock data for demonstration
  const mockStockData = {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 189.50,
    change: 2.75,
    changePercent: 1.47,
  };

  const mockTransactions = [
    { id: 1, timestamp: '2023-05-12 14:30', action: 'BUY', symbol: 'AAPL', price: 175.50, quantity: 10 },
    { id: 2, timestamp: '2023-05-13 10:15', action: 'BUY', symbol: 'MSFT', price: 320.25, quantity: 5 },
    { id: 3, timestamp: '2023-05-14 15:45', action: 'BUY', symbol: 'GOOGL', price: 140.80, quantity: 8 },
  ];

  const mockLeaderboard = [
    { rank: 1, username: 'trader123', value: 28750.45, returnPercent: 15.0 },
    { rank: 2, username: 'stockPro', value: 25980.30, returnPercent: 12.9 },
    { rank: 3, username: 'investorX', value: 24150.75, returnPercent: 10.6 },
    { rank: 4, username: 'marketGuru', value: 22340.60, returnPercent: 7.7 },
    { rank: 5, username: 'bullRun', value: 21090.15, returnPercent: 5.5 },
  ];

  useEffect(() => {
    ws.current = new WebSocket('ws://192.168.100.88:8015/ws/stock');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (Array.isArray(data)) {
          // Process the data and update holdings
          const updatedHoldings = data.map((stock) => {
            return {
              symbol: stock.symbol,
              name: stock.name || 'N/A',
              quantity: stock.total_traded_quantity,
              avgPrice: parseFloat(stock.close_price || 0),
              currentPrice: parseFloat(stock.ltp || 0),
              pl: (parseFloat(stock.ltp) - parseFloat(stock.close_price)) * stock.total_traded_quantity,
              plPercent: stock.close_price ? ((parseFloat(stock.ltp) - parseFloat(stock.close_price)) / parseFloat(stock.close_price)) * 100 : 0,
            };
          });
          setHoldings(updatedHoldings); // Update holdings with all 20 data
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.current.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.current) ws.current.close();
    };
  }, []);

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
                <p className="text-xl font-bold">${mockStockData.price}</p>
                <div className={`flex items-center justify-end ${mockStockData.change > 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                  {mockStockData.change > 0 ? <TrendingUpIcon size={16} /> : <TrendingDownIcon size={16} />}
                  <span className="ml-1">
                    ${Math.abs(mockStockData.change)} ({Math.abs(mockStockData.changePercent)}%)
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
                ${(mockStockData.price * quantity).toFixed(2)}
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
          <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Your Holdings</h2>
              <button className="text-[#00FF88] hover:underline flex items-center">
                <RefreshCwIcon size={16} className="mr-1" />
                Refresh
              </button>
            </div>
            <div className="overflow-x-auto max-h-48 overflow-y-scroll">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-2 text-left">Symbol</th>
                    <th className="pb-2 text-right">Qty</th>
                    <th className="pb-2 text-right">Avg Price</th>
                    <th className="pb-2 text-right">Current</th>
                    <th className="pb-2 text-right">P/L</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding, index) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-3">
                        <div className="font-medium">{holding.symbol}</div>
                        <div className="text-xs text-gray-400">{holding.name}</div>
                      </td>
                      <td className="py-3 text-right">{holding.quantity}</td>
                      <td className="py-3 text-right">${holding.avgPrice?.toFixed(2) ?? '0.00'}</td>
                      <td className="py-3 text-right">${holding.currentPrice?.toFixed(2) ?? '0.00'}</td>
                      <td className={`py-3 text-right ${holding.pl >= 0 ? 'text-[#00FF88]' : 'text-red-500'}`}>
                        ${Math.abs(holding.pl)?.toFixed(2) ?? '0.00'} ({Math.abs(holding.plPercent)?.toFixed(1) ?? '0.0'}%)
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
            <h2 className="text-lg font-medium mb-4">Transaction History</h2>
            <div className="overflow-y-auto max-h-48">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-2 text-left">Date</th>
                    <th className="pb-2 text-left">Action</th>
                    <th className="pb-2 text-right">Symbol</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {mockTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-700">
                      <td className="py-2 text-sm">{tx.timestamp}</td>
                      <td className={`py-2 font-medium ${tx.action === 'BUY' ? 'text-[#00FF88]' : 'text-red-500'}`}>
                        {tx.action}
                      </td>
                      <td className="py-2 text-right">{tx.symbol}</td>
                      <td className="py-2 text-right">${tx.price.toFixed(2)}</td>
                      <td className="py-2 text-right">{tx.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#1A2D4D] rounded-lg p-5 shadow-lg">
            <h2 className="text-lg font-medium">Leaderboard</h2>
            <div className="overflow-y-auto max-h-48">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-700">
                    <th className="pb-2 text-left">Rank</th>
                    <th className="pb-2 text-left">Username</th>
                    <th className="pb-2 text-right">Portfolio Value</th>
                    <th className="pb-2 text-right">Return (%)</th>
                  </tr>
                </thead>
                <tbody>
                  {mockLeaderboard.map((leader) => (
                    <tr key={leader.rank} className="border-b border-gray-700">
                      <td className="py-2">{leader.rank}</td>
                      <td className="py-2">{leader.username}</td>
                      <td className="py-2 text-right">${leader.value.toFixed(2)}</td>
                      <td className="py-2 text-right">{leader.returnPercent.toFixed(2)}%</td>
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
