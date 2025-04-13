// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard/Dashboard';
import StockTerminology from './pages/StockTerminology/StockTerminology';
import VirtualTrading from './pages/VirtualTrading/VirtualTrading';
import LearningModules from './pages/LearningModules/LearningModules';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import NotFound from './pages/NotFound';
import Candle from './pages/candlechar/candleChart';
import Live from './pages/VirtualTrading/livemarket'
import AIAssistant from './pages/AIAssistant/AIAssistant';
import Learning from './pages/learning models/learning';
import Trading from './pages/VirtualTrading/trading';
import StockDetails from './pages/VirtualTrading/StockDetails';

// Import Stock Game Components
import StockTerminologyFlashcards from './pages/StockTerminology/games/StockTerminologyFlashcards';
import StockTerminologyMatching from './pages/StockTerminology/games/StockTerminologyMatching';
import StockFillBlankGame from './pages/StockTerminology/games/StockFillBlankGame';

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
          <Route path='/ai-assistant' element={<AIAssistant />} />
          <Route path='/learning' element={<Learning />} />
          <Route path='/trading' element={<Trading />} />
          {/* <Route path='/details' element={<StockDetails/>}/>  */}
          {/* <Route path="/stock/:symbol" component={<StockDetails/>} /> */}
          <Route path="/:symbol" element={<StockDetails />} />


          
          <Route path="virtual-trading" element={
            <ProtectedRoute><VirtualTrading /></ProtectedRoute>
          } />
          <Route path="learning-modules" element={
            <ProtectedRoute><LearningModules /></ProtectedRoute>
          } />

          <Route path="stock-terminology" element={
            <ProtectedRoute><StockTerminology /></ProtectedRoute>
          } />
           <Route path="ai-assistant" element={
            <ProtectedRoute><AIAssistant/></ProtectedRoute>
          } />

          {/* New Stock Terminology Game Routes */}
          <Route path="stock-terminology/flashcards" element={
            <ProtectedRoute><StockTerminologyFlashcards /></ProtectedRoute>
          } />
          <Route path="stock-terminology/matching" element={
            <ProtectedRoute><StockTerminologyMatching /></ProtectedRoute>
          } />
          <Route path="stock-terminology/memory" element={
            <ProtectedRoute><StockFillBlankGame /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;