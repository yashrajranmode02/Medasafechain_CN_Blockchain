// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('msc_user');
    const token = localStorage.getItem('msc_token');
    if (stored && token) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const login = (userData, token) => {
    localStorage.setItem('msc_user', JSON.stringify(userData));
    localStorage.setItem('msc_token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('msc_user');
    localStorage.removeItem('msc_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
