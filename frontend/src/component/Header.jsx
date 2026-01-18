// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Cpu } from "lucide-react";

export default function Header() {
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
        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center text-blue-500">
            <ShieldCheck size={28} className="mr-2" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              MediSafeChain
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <NavLink
            to="/manufacturer"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            Manufacturer
          </NavLink>
          <NavLink
            to="/distributor"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            Distributor
          </NavLink>
          <NavLink
            to="/consumer"
            className={({ isActive }) => (isActive ? active : inactive)}
          >
            Consumer
          </NavLink>
        </nav>

        {/* Animated Right Icon */}
        <motion.div
          whileHover={{ rotate: 20, scale: 1.2 }}
          transition={{ type: "spring", stiffness: 150 }}
          className="text-blue-500 cursor-pointer"
        >
          <Cpu size={26} />
        </motion.div>
      </div>
    </motion.header>
  );
}
