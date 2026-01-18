// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Header from "./component/Header";
import ManufacturerPage from "./pages/manufacturerpage";
import DistributorPage from "./pages/Distributorpage";
import ConsumerPage from "./pages/consumerpage";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.5 }}
        className="px-6 py-8 max-w-7xl mx-auto"
      >
        <Routes location={location}>
          <Route path="/" element={<Navigate to="/manufacturer" replace />} />
          <Route path="/manufacturer" element={<ManufacturerPage />} />
          <Route path="/distributor" element={<DistributorPage />} />
          <Route path="/consumer" element={<ConsumerPage />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
        {/* Background accent gradient glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-32 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-32 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-200"></div>
        </div>

        <Header />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
