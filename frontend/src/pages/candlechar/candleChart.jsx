// CandleChart.jsx
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CandleChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth,
      height: 300,
      layout: { background: { color: "#ffffff" }, textColor: "#1f2937" },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' }
      },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderVisible: false,
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444"
    });

    const ws = new WebSocket("ws://192.168.100.88:8015/ws/chart");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      candleSeries.setData(data);
    };

    return () => ws.close();
  }, []);

  return <div ref={chartRef} className="w-full h-full rounded-lg" />;
};

export default CandleChart;
