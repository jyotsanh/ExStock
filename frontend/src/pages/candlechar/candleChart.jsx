// CandleChart.jsx
import React, { useEffect, useRef } from "react";
import { createChart } from "lightweight-charts";

const CandleChart = () => {
  const chartRef = useRef();

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      width: chartRef.current.clientWidth || 600,
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

    const handleResize = () => {
      chart.applyOptions({ width: chartRef.current.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    const ws = new WebSocket("ws://192.168.100.88:8015/ws/chart");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (Array.isArray(data)) {
        candleSeries.setData(data);
      } else {
        candleSeries.update(data);
      }
    };

    return () => {
      ws.close();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <div ref={chartRef} className="w-full h-[300px] rounded-lg" />;
};

export default CandleChart;
