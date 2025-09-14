import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load user from token on app start
  useEffect(() => {
    if (token) {
      // In a real app, you might validate the token here
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, [token]);

  // Add this function to your AuthContext
  const register = async (email, password, tenantName, role = 'MEMBER') => {
  try {
    setLoading(true);
    setError('');
    
    const response = await authAPI.register({ 
      email, 
      password, 
      tenantName,
      role 
    });
    
    const { token: newToken, user: userData } = response.data;
    
    // Save to localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    setToken(newToken);
    setUser(userData);
    
    return { success: true };
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Registration failed';
    setError(errorMessage);
    return { success: false, error: errorMessage };
  } finally {
    setLoading(false);
  }
};




  const login = async (email, password) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await authAPI.login({ email, password });
      const { token: newToken, user: userData } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Update state
      setToken(newToken);
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };


const value = {
  user,
  token,
  loading,
  error,
  login,
  register,  
  logout,
  isAuthenticated: !!token,
};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
