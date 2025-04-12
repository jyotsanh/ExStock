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
    <div className="p-4 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">📊 Live NEPSE Stock Data</h1>

      <div className="overflow-x-auto">
        <div className="max-h-[80vh] overflow-y-auto border border-gray-700 rounded-lg shadow-lg">
          <table className="min-w-full bg-gray-800 text-sm text-left">
            <thead className="sticky top-0 bg-gray-700 text-xs font-semibold text-gray-300 uppercase z-10">
              <tr>
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">LTP (₨)</th>
                <th className="px-4 py-3">% Change</th>
                <th className="px-4 py-3">Open</th>
                <th className="px-4 py-3">High</th>
                <th className="px-4 py-3">Low</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">P.Close</th>
                <th className="px-4 py-3">Diff</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {stocks.map((stock, index) => {
                const isProfit = parseFloat(stock.ltp) > parseFloat(stock.pclose);
                const isLoss = parseFloat(stock.ltp) < parseFloat(stock.pclose);
                const isUnchanged = parseFloat(stock.ltp) === parseFloat(stock.pclose);

                return (
                  <tr
                    key={index}
                    className={
                      isProfit
                        ? "bg-green-900/30 hover:bg-green-900/40 text-green-400"
                        : isLoss
                        ? "bg-red-900/30 hover:bg-red-900/40 text-red-400"
                        : "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    }
                  >
                    <td className="px-4 py-3 font-medium">{stock.symbol}</td>
                    <td className="px-4 py-3 font-semibold">{stock.ltp}</td>
                    <td className={`px-4 py-3 font-medium ${
                      isProfit ? "text-green-400" : 
                      isLoss ? "text-red-400" : 
                      "text-gray-400"
                    }`}>
                      {stock.percent_change}
                    </td>
                    <td className="px-4 py-3">{stock.open}</td>
                    <td className="px-4 py-3">{stock.high}</td>
                    <td className="px-4 py-3">{stock.low}</td>
                    <td className="px-4 py-3">{stock.qty}</td>
                    <td className="px-4 py-3">{stock.pclose}</td>
                    <td className={`px-4 py-3 ${
                      isProfit ? "text-green-400" : 
                      isLoss ? "text-red-400" : 
                      "text-gray-400"
                    }`}>
                      {stock.diff}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
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