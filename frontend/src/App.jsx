import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/navbar'
import Footer from './components/footer/footer'

function App() {
  return (
    <Router>
     <Navbar /> 

     <Routes>
     <Route path="/" element={<Home />} />
      
     </Routes>

     <Footer />
     </Router>
  )
}

export default App
