// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./component/Header";
import ManufacturerPage from "./pages/manufacturerpage";
import DistributorPage from "./pages/Distributorpage";
import ConsumerPage from "./pages/consumerpage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AIDashboard from "./pages/AIDashboard";

// Protected route: redirects to /login if not authenticated or wrong role
function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role}`} replace />;
  }
  return children;
}

// Public route: redirects logged-in users to their dashboard
function PublicRoute({ children }) {
  const { user } = useAuth();
  if (user) return <Navigate to={`/${user.role}`} replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="px-6 py-8 max-w-7xl mx-auto"
      >
        <Routes location={location}>
          {/* Public Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

          {/* Protected Dashboard Routes */}
          <Route path="/manufacturer" element={
            <ProtectedRoute requiredRole="manufacturer"><ManufacturerPage /></ProtectedRoute>
          } />
          <Route path="/distributor" element={
            <ProtectedRoute requiredRole="distributor"><DistributorPage /></ProtectedRoute>
          } />
          <Route path="/consumer" element={
            <ProtectedRoute requiredRole="consumer"><ConsumerPage /></ProtectedRoute>
          } />
          <Route path="/ai-insights" element={
            <ProtectedRoute><AIDashboard /></ProtectedRoute>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-32 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-32 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse delay-200" />
          </div>

          <Header />
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}
