import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./pages/Dashboard/DashboardLayout"; // update path as needed

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
