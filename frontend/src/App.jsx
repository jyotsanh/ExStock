// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import VirtualTrading from './pages/VirtualTrading/VirtualTrading';
import LearningModules from './pages/LearningModules/LearningModules';
import Login from './pages/Login/Login';
import Signup from './pages/signup/Signup';
import NotFound from './pages/NotFound';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
      const handleStorageChange = () => {
        setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
      };
      handleStorageChange();
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="virtual-trading" element={
            <ProtectedRoute><VirtualTrading /></ProtectedRoute>
          } />
          <Route path="learning-modules" element={
            <ProtectedRoute><LearningModules /></ProtectedRoute>
          } />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
