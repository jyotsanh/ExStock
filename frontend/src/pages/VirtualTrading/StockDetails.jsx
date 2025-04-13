import React, { use, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function StockDetail() {
  const { symbol } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);
  const [showTradeForm, setShowTradeForm] = useState(false);
  const [actionType, setActionType] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [virtualAmount, setVirtualAmount] = useState(10000); // Initial virtual balance

  

  // Fetch stock data
  useEffect(() => {
    const fetchStockDetails = async () => {
      try {
        const response = await fetch(`http://192.168.100.88:8015/${symbol}`);
        if (!response.ok) throw new Error("Stock fetch failed");
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load stock details.");
      }
    };
    fetchStockDetails();
  }, [symbol]);

  const handleOpenTradeForm = (type) => {
    setActionType(type);
    setQuantity(0);
    setShowTradeForm(true);
  };

  const handleTrade = async () => {
    const userId = localStorage.getItem("browserId")

    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    const price = details.market_price;
    const totalAmount = quantity * price;

    if (actionType === "buy" && totalAmount > virtualAmount) {
      toast.error("Insufficient virtual balance");
      return;
    }

    // Prepare trade data
    const tradeData = {
      userId: userId, // Logged-in user ID from localStorage
      symbol: details.symbol, // Stock symbol (e.g., AAPL)
      action: actionType, // buy/sell
      quantity: quantity, // Quantity of shares
      price: Number(price), // Stock price
    };

    console.log("Sending trade data:", tradeData); // Debug log to check data being sent

    try {
      const response = await fetch("http://192.168.100.81:3000/trade/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tradeData), // Send trade data as the body
      });

      const resText = await response.text();
      console.log("Trade response:", resText);

      if (!response.ok) {
        throw new Error(resText);
      }

      toast.success(`Successfully ${actionType}ed ${quantity} shares of ${details.symbol}`);

      // Update virtual balance after trade
      setVirtualAmount((prev) =>
        actionType === "buy" ? prev - totalAmount : prev + totalAmount
      );

      // Update stock details
      setDetails((prev) => ({
        ...prev,
        shares_outstanding:
          actionType === "buy"
            ? prev.shares_outstanding - quantity
            : prev.shares_outstanding + quantity,
      }));

      setShowTradeForm(false);
    } catch (err) {
      console.error("Trade error:", err);
      toast.error(err.message || "Transaction failed");
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

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!details) return <div className="text-white p-4">Loading stock data...</div>;

  return (
    <div className="p-4 text-white">
      <Toaster />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {details.company_name} ({details.symbol})
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => handleOpenTradeForm("buy")}
            className="px-4 py-2 bg-green-600 rounded"
          >
            Buy
          </button>
          <button
            onClick={() => handleOpenTradeForm("sell")}
            className="px-4 py-2 bg-red-600 rounded"
          >
            Sell
          </button>
        </div>
      </div>

      <div className="mb-4 text-yellow-400">
        Virtual Coins: Rs. {virtualAmount.toFixed(2)}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="bg-gray-800 p-4 rounded-lg">
            <div className="text-sm text-gray-400">
              {labelMap[key] || key}
            </div>
            <div className="text-lg font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {showTradeForm && (
        <div className="mt-8 p-6 bg-gray-900 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl mb-4 capitalize">
            {actionType} Shares
          </h3>
          <p className="mb-2">Symbol: <strong>{details.symbol}</strong></p>
          <p className="mb-2">Price: Rs. <strong>{details.market_price}</strong></p>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full p-2 mb-3 rounded bg-gray-700 text-white"
            placeholder="Enter quantity"
          />

          <button
            onClick={handleTrade}
            className={`w-full py-2 rounded text-white ${actionType === 'buy' ? 'bg-green-600' : 'bg-red-600'}`}
          >
            Confirm {actionType}
          </button>
        </div>
      )}
    </div>
  );
}
