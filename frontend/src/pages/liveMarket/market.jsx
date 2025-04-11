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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📈 Live NEPSE Stock Data</h1>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="sticky top-0 bg-gray-100 text-xs font-semibold text-gray-700 uppercase z-10">
              <tr>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">Close</th>
                <th className="px-4 py-2">Open</th>
                <th className="px-4 py-2">High</th>
                <th className="px-4 py-2">Low</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">Value</th>
                <th className="px-4 py-2">Trades</th>
                <th className="px-4 py-2">LTP</th>
                <th className="px-4 py-2">52W High</th>
                <th className="px-4 py-2">52W Low</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stocks.map((stock, index) => {
                const isProfit = parseFloat(stock.ltp) > parseFloat(stock.close_price);
                const isLoss = parseFloat(stock.ltp) < parseFloat(stock.close_price);

                return (
                  <tr
                    key={index}
                    className={
                      isProfit
                        ? "bg-green-50 text-green-800"
                        : isLoss
                        ? "bg-red-50 text-red-800"
                        : "text-gray-700"
                    }
                  >
                    <td className="px-4 py-2 font-medium">{stock.symbol}</td>
                    <td className="px-4 py-2">{stock.close_price}</td>
                    <td className="px-4 py-2">{stock.open_price}</td>
                    <td className="px-4 py-2">{stock.high_price}</td>
                    <td className="px-4 py-2">{stock.low_price}</td>
                    <td className="px-4 py-2">{stock.total_traded_quantity}</td>
                    <td className="px-4 py-2">{stock.total_traded_value}</td>
                    <td className="px-4 py-2">{stock.total_trades}</td>
                    <td className="px-4 py-2 font-semibold">{stock.ltp}</td>
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
    </div>
  );
};

export default StockWebSocketViewer;
