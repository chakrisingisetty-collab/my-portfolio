import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioApi } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('portfolio_access_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await portfolioApi.getMe();
          setUser(res.data);
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };
    fetchCurrentUser();
  }, [token]);

  const login = async (username, password) => {
    const res = await portfolioApi.login(username, password);
    const { access, refresh } = res.data;
    localStorage.setItem('portfolio_access_token', access);
    localStorage.setItem('portfolio_refresh_token', refresh);
    setToken(access);

    // Fetch user details
    const meRes = await portfolioApi.getMe();
    setUser(meRes.data);
    return meRes.data;
  };

  const logout = () => {
    localStorage.removeItem('portfolio_access_token');
    localStorage.removeItem('portfolio_refresh_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isAuthenticated: !!token && !!user,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
