import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function StockDetail() {
  const { symbol } = useParams();
  const [details, setDetails] = useState(null);
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   console.log("Symbol:", symbol); 
  //   const fetchStockDetails = async () => {

  //     // console.log("this is ;from fetch", symbol)
  //     try {
  //       console.log(`Fetching data for ${symbol}...`);
  //       const response = await fetch(`http://192.168.100.88:8015/${symbol}`);

  //       console.log("this is respone", response)

  //       // if (!response.ok) {
  //       //   throw new Error(`HTTP error! Status: ${response.status}`);
  //       // }

  //       // const data = await response.json();
  //       // console.log("Fetched data:", data); 
  //       // setDetails(data);

  //     } catch (err) {
  //       console.error("Error fetching stock details:", err);
  //       if (err.message.includes("NetworkError")) {
  //         setError('Network error: Unable to reach the server.');
  //       } 
  //       else {
  //         setError('Failed to fetch data one');
  //       }
  //     }
  //   };

  //   fetchStockDetails();
  // }, [symbol]);

  useEffect(() => {
    console.log("Symbol:", symbol); 
  
    const fetchStockDetails = async () => {
      try {
        console.log(`Fetching data for ${symbol}...`);
  
        const response = await fetch(`http://192.168.100.88:8015/${symbol}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
           
          }
        });
  
        console.log("This is response:", response);
  
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
  
        const data = await response.json();
        console.log("Fetched data:", data); 
        setDetails(data);
  
      } catch (err) {
        console.error("Error fetching stock details:", err);
        if (err.message.includes("NetworkError")) {
          setError('Network error: Unable to reach the server.');
        } else {
          setError('Failed to fetch data one');
        }
      }
    };
  
    fetchStockDetails();
  }, [symbol]);
  
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
      <h2 className="text-2xl font-bold mb-4">
        {details.company_name} ({details.symbol})
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(details).map(([key, value]) => (
          <div key={key} className="bg-gray-800 p-4 rounded-lg shadow">
            <div className="text-sm text-gray-400">{labelMap[key] || key.replace(/_/g, ' ')}</div>
            <div className="text-lg font-medium">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
  