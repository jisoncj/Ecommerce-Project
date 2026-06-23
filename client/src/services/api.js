import axios from 'axios';

// Define the base URL for the backend API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("API_URL =", API_URL);

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to inject the JWT token into the headers of every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
