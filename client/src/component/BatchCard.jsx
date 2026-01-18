// src/components/BatchCard.jsx
import React from "react";
import { motion } from "framer-motion";

export default function BatchCard({ title, children }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 200, damping: 12 }}
      className="relative group bg-gradient-to-br from-gray-900 via-gray-800 to-black 
                 rounded-2xl p-[2px] shadow-lg hover:shadow-blue-500/30 
                 transition-all duration-500"
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-600 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500"></div>

      {/* Inner card */}
      <div className="relative bg-black/80 backdrop-blur-md rounded-2xl p-5 border border-gray-800">
        {title && (
          <div className="text-sm uppercase tracking-wide font-semibold mb-3 text-blue-400">
            {title}
          </div>
        )}

        <div className="text-gray-300 text-sm leading-relaxed">{children}</div>
      </div>
    </motion.div>
  );
}
