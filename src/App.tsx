import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import "./index.css";

// import Dashboard from "./pages/Dashboard";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
