import React, { useEffect, useState } from "react";

const StockWebSocketViewer = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const ws = new WebSocket("ws://192.168.100.88:8015/ws/v2");

    ws.onmessage = (event) => {
      const rawData = JSON.parse(event.data);

      const formattedData = rawData.map((item) => ({
        symbol: item.symbol,
        ltp: item.ltp,
        percent_change: item.percent_change,
        open: item.open,
        high: item.high,
        low: item.low,
        qty: item.qty,
        pclose: item.pclose,
        diff: item.diff,
        timestamp: new Date().toISOString(), // or item.timestamp if available
      }));

      // Merge and deduplicate by symbol
      setStocks((prevStocks) => {
        const map = new Map(prevStocks.map((s) => [s.symbol, s]));
        formattedData.forEach((item) => map.set(item.symbol, item));
        return Array.from(map.values());
      });
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
      <h1 className="text-2xl font-bold mb-4 text-gray-800">📊 Live NEPSE Stock Data</h1>

      <div className="overflow-x-auto">
        <div className="max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
          <table className="min-w-full bg-white text-sm text-left">
            <thead className="sticky top-0 bg-gray-100 text-xs font-semibold text-gray-700 uppercase z-10">
              <tr>
                <th className="px-4 py-2">Symbol</th>
                <th className="px-4 py-2">LTP (₨)</th>
                <th className="px-4 py-2">% Change</th>
                <th className="px-4 py-2">Open</th>
                <th className="px-4 py-2">High</th>
                <th className="px-4 py-2">Low</th>
                <th className="px-4 py-2">Qty</th>
                <th className="px-4 py-2">P.Close</th>
                <th className="px-4 py-2">Diff</th>
                <th className="px-4 py-2">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stocks.map((stock, index) => {
                const isProfit = parseFloat(stock.ltp) > parseFloat(stock.pclose);
                const isLoss = parseFloat(stock.ltp) < parseFloat(stock.pclose);

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
                    <td className="px-4 py-2">{stock.ltp}</td>
                    <td className="px-4 py-2">{stock.percent_change}</td>
                    <td className="px-4 py-2">{stock.open}</td>
                    <td className="px-4 py-2">{stock.high}</td>
                    <td className="px-4 py-2">{stock.low}</td>
                    <td className="px-4 py-2">{stock.qty}</td>
                    <td className="px-4 py-2">{stock.pclose}</td>
                    <td className="px-4 py-2">{stock.diff}</td>
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
