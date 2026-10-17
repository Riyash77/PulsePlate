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

api.interceptors.request.use(config => {
  const token = localStorage.getItem('sp_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
