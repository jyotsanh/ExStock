import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  TrendingUp,
  BookOpen,
  Book,
  Bot,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/" },
  { name: "Virtual Trading", icon: <TrendingUp size={18} />, path: "/virtual-trading" },
  { name: "Learning Modules", icon: <BookOpen size={18} />, path: "/learning-modules" },
  { name: "Stock Terminology", icon: <Book size={18} />, path: "/stock-terminology" },
  { name: "AI Assistant", icon: <Bot size={18} />, path: "/ai-assistant" },
];

const SideNavbar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-[#0d1b2a] text-white flex flex-col justify-between">
      {/* Top Section */}
      <div>
        <div className="p-6">
          <h1 className="text-2xl text-cyan-400">ExoStock</h1>
          <p className="text-sm text-gray-400 mt-1">Stock Market Learning</p>
        </div>

        <nav className="mt-4">
          {menuItems.map((item, idx) => (
            <Link
              key={idx}
              to={item.path}
              className={`flex items-center px-6 py-3 text-sm cursor-pointer hover:bg-cyan-700 transition ${
                location.pathname === item.path ? "bg-cyan-700" : ""
              }`}
            >
              <div className="mr-3">{item.icon}</div>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Bottom User Profile */}
      <div className="flex items-center gap-3 px-6 py-4 bg-[#1e293b]">
        <div className="bg-cyan-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold">
          
        </div>
        <div>
          <p className="text-sm font-medium">User123</p>
          <p className="text-xs text-gray-300">₹125,000</p>
        </div> 
      </div>
    </div>
  );
};

export default SideNavbar;
