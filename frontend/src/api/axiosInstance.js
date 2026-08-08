import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with backend URL
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token automatically to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // JWT auth standard
  }
  return config;
});

// Handle Standard Response Envelope
api.interceptors.response.use(
  (response) => response.data, // Unwraps { success, message, data } directly
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // window.location.href = '/login';
      window.location.href = '/signin';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
