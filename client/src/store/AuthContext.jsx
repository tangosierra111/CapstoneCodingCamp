// Auth Context - State management for authentication
import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in (token exists)
    const init = async () => {
      const token = authService.getToken();
      if (token) {
        authService.setToken(token);
        try {
          const res = await userService.getProfile();
          setUser({ ...res.data.user, token });
        } catch (err) {
          // If profile fetch fails, keep minimal user with token
          setUser({ token });
        }
      }
      setLoading(false);
    };

    init();
  }, []);

  const register = async (firstName, lastName, email, password, educationLevel) => {
    try {
      setError(null);
      const response = await authService.register(firstName, lastName, email, password, educationLevel);
      const { token, user: userData } = response.data;
      authService.setToken(token);
      setUser({ ...userData, token });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      const { token, user: userData } = response.data;
      authService.setToken(token);
      setUser({ ...userData, token });
      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw err;
    }
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
