// StockDetails.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const StockDetails = ({ symbol, onBack }) => {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    if (!symbol) return;

    axios
      .get(`http://192.168.100.88:8015/${symbol}`)
      .then((res) => {
        setDetails(res.data);
      })
      .catch((err) => {
        console.error("Error fetching stock detail:", err);
      });
  }, [symbol]);

  if (!details) return <p className="text-white p-4">Loading...</p>;

  return (
    <div className="p-4 text-white bg-gray-900">
      <button onClick={onBack} className="mb-4 px-3 py-1 bg-blue-500 rounded">
        ⬅ Back
      </button>
      <h2 className="text-xl font-bold mb-2">{details.company_name} ({details.symbol})</h2>
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="bg-gray-800 p-2 rounded">
            <strong>{key.replace(/_/g, " ")}:</strong> {value}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockDetails;
