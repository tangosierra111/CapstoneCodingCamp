// API Service for prediction operations
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const predictionService = {
  predict: (inputData) => {
    return axios.post(`${API_URL}/predict`, inputData);
  },

  getHistory: () => {
    return axios.get(`${API_URL}/predict/history`);
  },

  getHistoryDetail: (datasetId) => {
    return axios.get(`${API_URL}/predict/history/${datasetId}`);
  }
};

export default predictionService;
