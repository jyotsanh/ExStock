import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/Dashboard/DashboardLayout"; // update path as needed
import SideNavbar from "../src/components/Navbar/navbar";
import Chatbot from "./pages/chabot/chatbot";

const App = () => {
  return (
    <Router>
      <div className="flex h-screen">
        {/* Sidebar on the left */}
        <SideNavbar />

        {/* Main content on the right */}
        <div className="flex-1 bg-gray-50 overflow-y-auto">
          <Routes>
            <Route path="/" element={<DashboardLayout />} />
          </Routes>
          <Chatbot/>
        </div>
      </div>
    </Router>
  );
};

export default App;
