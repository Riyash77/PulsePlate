import axios from 'axios';
import { setupMock } from './mockApi';

const rawUrl = import.meta.env.VITE_API_URL;
const API_BASE = (rawUrl && !rawUrl.includes('PLACEHOLDER'))
  ? rawUrl
  : 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  timeout: 8000,
});

// Enable mock mode if explicitly requested
const MOCK_MODE = import.meta.env.VITE_MOCK_MODE === 'true';
if (MOCK_MODE) {
  setupMock(api);
}

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 - redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pp_token');
      localStorage.removeItem('pp_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
