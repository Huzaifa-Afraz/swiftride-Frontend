import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // Check if data exists AND is not the string "undefined"
    if (storedUser && token && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // If parsing fails, clear the corrupt data
        console.error("Corrupt auth data found, clearing...", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
      }
    } else {
      // Clean up if data is incomplete or invalid
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};