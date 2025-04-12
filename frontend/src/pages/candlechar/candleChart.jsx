import { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const CandlestickChart = () => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const [stockData, setStockData] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('ADBL');
  const [availableSymbols, setAvailableSymbols] = useState([]);
  const socketRef = useRef(null);

  // Process the incoming data
  const processData = (data) => {
    try {
      const parsedData = JSON.parse(data);
      
      // Update available symbols list if not already set
      if (availableSymbols.length === 0) {
        const symbols = parsedData.map(item => item.symbol);
        setAvailableSymbols(symbols);
      }
      
      // Filter data for selected symbol and format it for the chart
      const filteredData = parsedData.filter(item => item.symbol === selectedSymbol);
      
      if (filteredData.length > 0) {
        const item = filteredData[0];
        
        // Convert string values to numbers and handle comma formatting
        const formatNumber = (value) => parseFloat(value.replace(/,/g, ''));
        
        const newCandle = {
          time: new Date(item.timestamp).getTime() / 1000,
          open: formatNumber(item.open_price),
          high: formatNumber(item.high_price),
          low: formatNumber(item.low_price),
          close: formatNumber(item.close_price)
        };
        
        // Add new data point to the chart
        setStockData(prevData => {
          // Keep only the last 100 data points for performance
          const updatedData = [...prevData, newCandle].slice(-100);
          return updatedData;
        });
      }
    } catch (error) {
      console.error('Error processing WebSocket data:', error);
    }
  };

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      const socket = new WebSocket('ws://192.168.100.88:8016/ws/stock');
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
      };
      
      socket.onmessage = (event) => {
        processData(event.data);
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.reason);
        // Attempt to reconnect after 5 seconds
        setTimeout(connectWebSocket, 5000);
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        socket.close();
      };
      
      socketRef.current = socket;
    };
    
    connectWebSocket();
    
    // Clean up WebSocket connection on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  // Update WebSocket connection when selected symbol changes
  useEffect(() => {
    // No need to reconnect, as we filter the data in the processData function
  }, [selectedSymbol]);

  // Create and update chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Initialize chart if it doesn't exist
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          backgroundColor: '#ffffff',
          textColor: '#333',
        },
        grid: {
          vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
          horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
      
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
    }
    
    // Handle window resize
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update chart when data changes
  useEffect(() => {
    if (candlestickSeriesRef.current && stockData.length > 0) {
      candlestickSeriesRef.current.setData(stockData);
      
      // Automatically fit content after data update
      chartRef.current.timeScale().fitContent();
    }
  }, [stockData]);

  // Handle symbol change
  const handleSymbolChange = (event) => {
    setSelectedSymbol(event.target.value);
    // Clear previous data when changing symbols
    setStockData([]);
  };

  return (
    <div className="chart-container">
      <div className="chart-controls">
        <h2>Stock: {selectedSymbol} Candlestick Chart</h2>
        <select 
          value={selectedSymbol} 
          onChange={handleSymbolChange}
          className="symbol-select"
        >
          {availableSymbols.map(symbol => (
            <option key={symbol} value={symbol}>{symbol}</option>
          ))}
        </select>
      </div>
      
      <div 
        ref={chartContainerRef} 
        className="chart" 
        style={{ height: '400px', width: '100%' }}
      />
      
      <div className="stats">
        {stockData.length > 0 && (
          <div>
            <p>Latest Data Point: {new Date(stockData[stockData.length - 1].time * 1000).toLocaleString()}</p>
            <p>Open: {stockData[stockData.length - 1].open.toFixed(2)}</p>
            <p>High: {stockData[stockData.length - 1].high.toFixed(2)}</p>
            <p>Low: {stockData[stockData.length - 1].low.toFixed(2)}</p>
            <p>Close: {stockData[stockData.length - 1].close.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandlestickChart;