// API Service for authentication
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const authService = {
  register: (firstName, lastName, email, password, educationLevel) => {
    return axios.post(`${API_URL}/auth/register`, {
      firstName,
      lastName,
      email,
      password,
      educationLevel
    });
  },

  login: (email, password) => {
    return axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
  },

  logout: () => {
    localStorage.removeItem('token');
    return Promise.resolve();
  },

  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  removeToken: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default authService;
