import axios, { type InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    
    if (error.response?.status === 403) {
        localStorage.removeItem('token');
        setTimeout(() => {
            window.location.href = "/login"
        }, 1000);
    }

    if (error.response?.status === 401 && !original._retry) {
        if (original.url?.includes('/auth/login') || original.url?.includes('/auth/refresh')) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            const { data } = await api.post('/auth/refresh');
            const newAccessToken = data.accessToken;
            
            localStorage.setItem('token', newAccessToken);
            original.headers.Authorization = `Bearer ${newAccessToken}`;

            return api(original);
        } catch (err) {
            localStorage.removeItem('token');
            window.location.href = "/login";
            return Promise.reject(err);
        }
    }
    return Promise.reject(error);
  }
);

export default api;
