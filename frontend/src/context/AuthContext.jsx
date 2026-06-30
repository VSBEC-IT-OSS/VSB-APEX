import React, { createContext, useContext, useState, useEffect } from 'react';
import { isLoggedIn, clearAuthToken } from '../data/dataService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn()) {
      const stored = localStorage.getItem('vsb_user');
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {
          clearAuthToken();
          localStorage.removeItem('vsb_user');
        }
      }
    }
    setLoading(false);
  }, []);

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('vsb_user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    clearAuthToken();
    localStorage.removeItem('vsb_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
