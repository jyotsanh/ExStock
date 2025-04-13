import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const allStockSymbols = [
  'GCIL', 'GFCL', 'GHL', 'GIBF1', 'GILB', 'GILBPO', 'GLBSL', 'GLH', 'GMFBS', 'GMFIL', 'GMLI', 'GRDBL',
  'GSY', 'GUFL', 'GVL', 'GWFD83', 'H8020', 'HATHY', 'HBL', 'HDHPC', 'HDL', 'HEI', 'HEIP', 'HHL', 'HIDCL',
  'HIDCLP', 'HLBSL', 'HLI', 'HPPL', 'HRL', 'HURJA', 'ICFC', 'ICFCD83', 'ICFCD88', 'IGI', 'IHL', 'ILBS',
  'ILBSP', 'ILI', 'JBBL', 'JBLB', 'JFL', 'JOSHI', 'JSLBB', 'KBL', 'KBLD89', 'KBSH', 'KDBY', 'KDL', 'KEF',
  // ...add all remaining symbols
];

export default function LiveStockTable() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.100.88:8015/ws/v2');

    socket.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        if (!Array.isArray(rawData)) return;

        const filteredData = rawData.filter(item =>
          allStockSymbols.includes(item.symbol?.toUpperCase())
        );

        const formattedData = filteredData.map(item => ({
          symbol: item.symbol,
          ltp: item.ltp,
          percent_change: item.percent_change,
          open: item.open,
          high: item.high,
          low: item.low,
          qty: item.qty,
          pclose: item.pclose,
          diff: item.diff,
          timestamp: new Date().toISOString()
        }));

        setData(formattedData);
      } catch (error) {
        console.error('Error parsing WebSocket data:', error);
      }
    };

    return () => socket.close();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Live NEPSE Stock Data</h1>
      <table className="w-full table-auto border-collapse border border-gray-700 text-white">
        <thead className="bg-gray-800">
          <tr>
            <th className="border border-gray-700 px-2 py-1">Symbol</th>
            <th className="border border-gray-700 px-2 py-1">LTP</th>
            <th className="border border-gray-700 px-2 py-1">Change %</th>
            <th className="border border-gray-700 px-2 py-1">Open</th>
            <th className="border border-gray-700 px-2 py-1">High</th>
            <th className="border border-gray-700 px-2 py-1">Low</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-700 cursor-pointer"
              onClick={() => navigate(`/${item.symbol.toUpperCase()}`)}
            >
              <td className="border border-gray-700 px-2 py-1">{item.symbol}</td>
              <td className="border border-gray-700 px-2 py-1">{item.ltp}</td>
              <td className="border border-gray-700 px-2 py-1">{item.percent_change}</td>
              <td className="border border-gray-700 px-2 py-1">{item.open}</td>
              <td className="border border-gray-700 px-2 py-1">{item.high}</td>
              <td className="border border-gray-700 px-2 py-1">{item.low}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
