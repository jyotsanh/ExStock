import React, { useEffect, useState } from "react";

const StockWebSocketViewer = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.100.88:8015/ws/stock");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStocks(data);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="max-h-[360px] overflow-y-auto custom-scrollbar">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 bg-[#1B263B] text-gray-300 uppercase text-xs z-10">
            <tr>
              <th className="px-4 py-2 text-left">Symbol</th>
              <th className="px-4 py-2 text-left">Close</th>
              <th className="px-4 py-2 text-left">Open</th>
              <th className="px-4 py-2 text-left">High</th>
              <th className="px-4 py-2 text-left">Low</th>
              <th className="px-4 py-2 text-left">Qty</th>
              <th className="px-4 py-2 text-left">Value</th>
              <th className="px-4 py-2 text-left">Trades</th>
              <th className="px-4 py-2 text-left">LTP</th>
              <th className="px-4 py-2 text-left">52W High</th>
              <th className="px-4 py-2 text-left">52W Low</th>
              <th className="px-4 py-2 text-left">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1B263B]">
            {stocks.map((stock, index) => {
              const isProfit =
                parseFloat(stock.ltp) > parseFloat(stock.close_price);
              const isLoss =
                parseFloat(stock.ltp) < parseFloat(stock.close_price);

              return (
                <tr
                  key={index}
                  className={
                    isProfit
                      ? "text-green-400"
                      : isLoss
                      ? "text-red-400"
                      : "text-gray-200"
                  }
                >
                  <td className="px-4 py-2 font-semibold">{stock.symbol}</td>
                  <td className="px-4 py-2">{stock.close_price}</td>
                  <td className="px-4 py-2">{stock.open_price}</td>
                  <td className="px-4 py-2">{stock.high_price}</td>
                  <td className="px-4 py-2">{stock.low_price}</td>
                  <td className="px-4 py-2">{stock.total_traded_quantity}</td>
                  <td className="px-4 py-2">{stock.total_traded_value}</td>
                  <td className="px-4 py-2">{stock.total_trades}</td>
                  <td className="px-4 py-2 font-bold">{stock.ltp}</td>
                  <td className="px-4 py-2">{stock.fifty_two_week_high}</td>
                  <td className="px-4 py-2">{stock.fifty_two_week_low}</td>
                  <td className="px-4 py-2">
                    {new Date(stock.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LiveMarketCard = () => {
  return (
    <div className="bg-[#1B263B] text-white p-4 rounded-lg shadow-md max-h-[460px] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-md font-semibold">📡 Live Market</h2>
        <button className="text-green-400 text-sm hover:underline">
          🔄 Refresh
        </button>
      </div>
      <StockWebSocketViewer />
    </div>
  );
};

export default LiveMarketCard;
