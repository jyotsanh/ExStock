
import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, TrendingUpIcon, BookOpenIcon, BookmarkIcon, MessageCircleIcon} from 'lucide-react';

const Navbar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <HomeIcon size={20} /> },
    { name: 'Virtual Trading', path: '/virtual-trading', icon: <TrendingUpIcon size={20} /> },
    { name: 'Learning Modules', path: '/learning-modules', icon: <BookOpenIcon size={20} /> },
    { name: 'Stock Terminology', path: '/stock-terminology', icon: <BookmarkIcon size={20} /> },
    { name: 'AI Assistant', path: '/ai-assistant', icon: <MessageCircleIcon size={20} /> },
    ,
  ];

  return (
    <nav className="w-60 bg-[#0A1D3D] border-r border-gray-700 flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-[#00FF88]">Himal AI</h1>
        <p className="text-sm text-gray-300">Stock Market Learning</p>
      </div>
      
      <div className="flex flex-col flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 ${
                isActive
                  ? 'bg-[#1A2D4D] text-[#00FF88] border-l-4 border-[#00FF88]'
                  : 'text-gray-300 hover:bg-[#1A2D4D] hover:text-white'
              }`
            }
          >
            <span className="mr-3">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;