import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

// 📌 Replace this with your full list
const allStockSymbols = ["GILB", "NABIL", "NLIC", "PRVU", "SHIVM", "NRIC", "NICL", "NMB", "HBL"];

const socket = io("http://192.168.100.88:8015", {
  transports: ["websocket"],
  withCredentials: true,
});

export default function VirtualTrading() { 
  const [query, setQuery] = useState("");
  const [stockData, setStockData] = useState(null);
  const [error, setError] = useState(null);

  // 💬 Log socket connection
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 🔍 Search handler
  const handleSearch = async () => {
    const symbol = query.trim().toUpperCase();

    if (!allStockSymbols.includes(symbol)) {
      setError("Symbol not found.");
      setStockData(null);
      return;
    }

    try {
      const response = await axios.get(`http://192.168.100.88:8015/${symbol}`);
      setStockData(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch stock data.");
      setStockData(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto bg-black shadow rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">📈 Virtual Trading - NEPSE</h1>

        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Enter stock symbol (e.g. GILB)"
            className="flex-1 border p-2 rounded"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {stockData && (
          <div className="border rounded p-4 bg-gray-50">
            <h2 className="text-xl font-semibold mb-2">
              {stockData.company_name} ({stockData.symbol})
            </h2>
            <table className="w-full text-sm border-t">
              <tbody>
                <InfoRow label="Sector" value={stockData.sector} />
                <InfoRow label="Market Price (₨)" value={stockData.market_price} />
                <InfoRow label="Change (%)" value={stockData.percent_change} />
                <InfoRow label="Last Traded" value={stockData.last_traded_on} />
                <InfoRow label="52 Week High/Low" value={stockData["52_weeks_high_low"]} />
                <InfoRow label="EPS" value={stockData.eps} />
                <InfoRow label="P/E Ratio" value={stockData.p_e_ratio} />
                <InfoRow label="Book Value" value={stockData.book_value} />
                <InfoRow label="PBV" value={stockData.pbv} />
                <InfoRow label="Market Cap (₨)" value={stockData.market_capitalization} />
                <InfoRow label="Paid-up Value" value={stockData.total_paidup_value} />
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const InfoRow = ({ label, value }) => (
  <tr className="border-t">
    <td className="py-2 font-medium text-gray-700">{label}</td>
    <td className="py-2 text-right">{value}</td>
  </tr>
);
