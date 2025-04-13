import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function StockDetail() {
  const { symbol } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [actionType, setActionType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [transactionError, setTransactionError] = useState('');
  const [virtualAmount, setVirtualAmount] = useState(10000); // Rs. 10,000 starting balance

  const userId = '661b97b95a1234567890abcd'; // Replace this with logged-in user ID

  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await fetch(`http://192.168.100.88:8015/${symbol}`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        console.error("Error fetching stock details:", err);
        setError('Failed to fetch data.');
      }
    };

    fetchStockDetails();
  }, [symbol]);

  const handleOpenTradeForm = (type) => {
    setActionType(type);
    setQuantity(0);
    setTransactionError('');
    setShowTradeForm(true);
  };

  const handleTrade = async () => {
    if (quantity <= 0) {
      setTransactionError("Please enter a valid quantity.");
      return;
    }

    const price = details.market_price;
    const totalAmount = quantity * price;

    if (actionType === 'buy' && totalAmount > virtualAmount) {
      setTransactionError("Insufficient virtual coins.");
      return;
    }

    try {
      const response = await fetch('http://192.168.100.81:3000/trade/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: userId,
          symbol,
          quantity,
          action: actionType,
          price,
        }),
      });

      const resText = await response.text();
      console.log("Trade response:", resText);

      if (!response.ok) throw new Error(resText);

      setDetails((prev) => ({
        ...prev,
        shares_outstanding:
          actionType === 'buy'
            ? prev.shares_outstanding - quantity
            : prev.shares_outstanding + quantity,
      }));

      if (actionType === 'buy') {
        setVirtualAmount((prev) => prev - totalAmount);
      } else {
        setVirtualAmount((prev) => prev + totalAmount);
      }

      setShowTradeForm(false);
      setTransactionError('');
    } catch (err) {
      console.error("Trade Error:", err);
      setTransactionError("Transaction failed.");
    }
  };

  const labelMap = {
    symbol: 'Symbol',
    company_name: 'Company Name',
    sector: 'Sector',
    market_price: 'Market Price',
    percent_change: 'Percent Change',
    last_traded_on: 'Last Traded On',
    shares_outstanding: 'Shares Outstanding',
    '52_weeks_high_low': '52 Weeks High/Low',
    '180_day_average': '180 Day Avg',
    '120_day_average': '120 Day Avg',
    '1_year_yield': '1 Year Yield',
    eps: 'EPS',
    p_e_ratio: 'P/E Ratio',
    book_value: 'Book Value',
    pbv: 'PBV',
    '30_day_avg_volume': '30 Day Avg Volume',
    market_capitalization: 'Market Cap',
    paidup_value: 'Paidup Value',
    total_paidup_value: 'Total Paidup Value',
  };

  if (error) return <div className="p-4 text-red-400">Error: {error}</div>;
  if (!details) return <div className="p-4 text-white">Loading stock details for {symbol}...</div>;

  return (
    <div className="p-4 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {details.company_name} ({details.symbol})
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => handleOpenTradeForm('buy')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            Buy
          </button>
          <button
            onClick={() => handleOpenTradeForm('sell')}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Sell
          </button>
        </div>
      </div>

      <div className="mb-4 text-yellow-300">
        Virtual Coins: Rs. {virtualAmount.toFixed(2)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-400">
              {labelMap[key] || key.replace(/_/g, ' ')}
            </div>
            <div className="text-lg font-medium">{value}</div>
          </div>
        ))}
      </div>

      {showTradeForm && (
        <div className="mt-8 bg-gray-900 p-6 rounded-xl shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold mb-4 capitalize">
            {actionType} Shares
          </h3>
          <div className="mb-2">Symbol: <strong>{details.symbol}</strong></div>
          <div className="mb-2">Current Price: Rs. <strong>{details.market_price}</strong></div>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Enter quantity"
            className="w-full p-2 rounded bg-gray-700 text-white mb-3"
          />
          <button
            onClick={handleTrade}
            className={`w-full py-2 rounded text-white ${actionType === 'buy' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            Confirm {actionType}
          </button>
          {transactionError && (
            <div className="mt-2 text-red-500">{transactionError}</div>
          )}
        </div>
      )}
    </div>
  );
}
