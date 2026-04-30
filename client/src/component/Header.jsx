// src/components/Header.jsx
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ROLE_COLORS = {
  manufacturer: 'bg-blue-600',
  distributor: 'bg-purple-600',
  consumer: 'bg-emerald-600',
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const active =
    "text-white bg-blue-600 px-4 py-2 rounded-xl text-sm font-semibold shadow-md transition-all duration-300";
  const inactive =
    "text-gray-300 hover:text-white hover:bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300";

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      className="bg-black/90 backdrop-blur-md shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-blue-500">
            <ShieldCheck size={28} className="mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              MediSafeChain
            </span>
          </div>
        </div>

        {/* Nav — only show if logged in */}
        {user && (
          <nav className="flex items-center gap-2">
            {user.role === 'manufacturer' && (
              <NavLink to="/manufacturer" className={({ isActive }) => (isActive ? active : inactive)}>
                Manufacturer
              </NavLink>
            )}
            {user.role === 'distributor' && (
              <NavLink to="/distributor" className={({ isActive }) => (isActive ? active : inactive)}>
                Distributor
              </NavLink>
            )}
            {user.role === 'consumer' && (
              <NavLink to="/consumer" className={({ isActive }) => (isActive ? active : inactive)}>
                Consumer
              </NavLink>
            )}
            <NavLink to="/ai-insights" className={({ isActive }) => (isActive ? active : inactive)}>
              AI Insights
            </NavLink>
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* User pill */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                <div className={`w-2 h-2 rounded-full ${ROLE_COLORS[user.role]}`} />
                <span className="text-sm text-gray-300 font-medium">{user.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full text-white capitalize ${ROLE_COLORS[user.role]}`}>
                  {user.role}
                </span>
              </div>
              {/* Logout button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-3 py-1.5 rounded-full transition-all"
              >
                <LogOut size={14} />
                Logout
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 text-sm text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white px-4 py-1.5 rounded-full transition-all"
            >
              <User size={14} />
              Sign In
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
}
