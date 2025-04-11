// src/pages/Layout.jsx
import React from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar/navbar';
import { LogOutIcon, UserIcon, BellIcon } from 'lucide-react';

const Layout = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#071428] text-white">
      {isLoggedIn && <Navbar />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-[#0A1D3D] border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-medium">Stock Market Learning Platform</h1>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="relative">
                  <BellIcon className="h-6 w-6 text-gray-300 hover:text-white cursor-pointer" />
                  <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2"></span>
                </div>
                <div className="flex items-center cursor-pointer hover:bg-[#1A2D4D] py-1 px-2 rounded-md">
                  <div className="bg-[#1A2D4D] rounded-full p-1 mr-2">
                    <UserIcon className="h-5 w-5 text-[#00FF88]" />
                  </div>
                  <span className="mr-2">{user.name || 'User'}</span>
                  <button onClick={handleLogout} className="ml-4 text-gray-300 hover:text-white">
                    <LogOutIcon className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link to="/login" className="text-[#00BFFF] hover:text-[#00FF88]">
                  Login
                </Link>
                <Link to="/signup" className="text-[#00BFFF] hover:text-[#00FF88]">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

        <footer className="bg-[#0A1D3D] border-t border-gray-700 px-6 py-2 text-sm text-gray-400">
          <div className="flex justify-between items-center">
            <div>© 2025 Stock Learning Platform</div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Help</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;