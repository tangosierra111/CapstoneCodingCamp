// API Service for user operations
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const userService = {
  getProfile: () => {
    return axios.get(`${API_URL}/user/profile`);
  },

  updateProfile: (currentPassword, newPassword, educationLevel) => {
    return axios.put(`${API_URL}/user/update`, {
      currentPassword,
      newPassword,
      educationLevel
    });
  },

  deleteAccount: () => {
    return axios.delete(`${API_URL}/user/delete`);
  }
};

export default userService;
