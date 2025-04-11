import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/navbar'
import ChatBot from './pages/chabot/chatbot'
// import Footer from './components/footer/footer'

function App() {
  return (
    <Router>
     <Navbar /> 

     <Routes>
     {/* <Route path="/" element={<Home />} /> */}
     <Route path="/chatbot" element={<ChatBot />} /> 

     </Routes>

     {/* <Footer /> */}
     </Router>
  )
}

export default App
