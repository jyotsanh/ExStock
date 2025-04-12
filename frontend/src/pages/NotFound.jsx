// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#071428] p-4 text-center">
      <div className="max-w-md">
        <h1 className="text-6xl font-bold text-[#00FF88] mb-4">404</h1>
        <h2 className="text-2xl font-medium text-white mb-6">Page Not Found</h2>
        <p className="text-gray-300 mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00FF88] to-[#00BFFF] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;