import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('token');

      if (token && storedUser && storedUser !== 'undefined') {
        try {
          // 1. Always load LocalStorage data FIRST so app works immediately
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          // 2. Try to fetch fresh data, but DON'T crash if it fails
          try {
            const res = await authService.getCurrentUser();
            if (res.data) {
               // Support both structure formats
               const freshUser = res.data.data || res.data?.user;
               updateUser(freshUser); 
            }
          } catch (apiError) {
            console.warn("Background refresh failed (API might be missing), using local data.");
            // Only logout if it's strictly an AUTH error (401)
            if (apiError.response?.status === 401) {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              setUser(null);
            }
          }
        } catch (parseError) {
          console.error("Corrupt local data", parseError);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setLoading(false);
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password });
      // Support both {data: {token, user}} and {token, user}
      const data = response.data.data || response.data;
      const { token, user } = data;
      
      localStorage.setItem('token', token);
      updateUser(user);
      
      return { success: true, role: user.role };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const googleLogin = async (dataPayload) => {
    try {
      const response = await authService.googleLogin(dataPayload);
      const data = response.data.data || response.data; // Support diverse response shapes
      const { token, user } = data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        return { success: true, role: user.role };
      }
      return { success: false, message: "No token received" };
    } catch (error) {
       // Pass the error object back so caller can check status code (e.g. 400)
       // We attach the full error response data for the component to handle (e.g. "Role is required")
      return { 
        success: false, 
        message: error.response?.data?.message || "Google Login failed",
        status: error.response?.status 
      };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error", error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, googleLogin, logout, loading, updateUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};