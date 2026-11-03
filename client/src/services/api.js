import axios from 'axios';

/**
 * Centralized Axios API client instance
 * Automatically prefixes requests with /api (proxied in Vite to http://localhost:5000)
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if available in localStorage
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

// Response Interceptor: Format error messages consistently
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';
    return Promise.reject(new Error(message));
  }
);

/**
 * Health check service method
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;

