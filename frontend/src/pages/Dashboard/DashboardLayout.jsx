import React from "react";

import StockWebSocketViewer from "../liveMarket/market";
import CandleChart from "../candlechar/candleChart";
import NewsSection from "../NewsSections/NewsSections";
import CoursesSection from "../CoursesSection/CoursesSection";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">

      
      <div className="flex-1 grid grid-cols-2 gap-4 p-6 overflow-y-auto h-screen">
        {/* Middle Section */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-y-auto border-t-4 border-cyan-500">
            <StockWebSocketViewer />
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-y-auto border-t-4 border-indigo-500">
            <CandleChart />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-y-auto border-t-4 border-rose-400">
            <NewsSection />
          </div>
          <div className="flex-1 bg-white rounded-2xl shadow-lg p-4 overflow-y-auto border-t-4 border-emerald-500">
            <CoursesSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;