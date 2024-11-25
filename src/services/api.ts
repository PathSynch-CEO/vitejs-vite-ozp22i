import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.pathsynch.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const LocationsAPI = {
  getAll: () => api.get('/locations'),
  getById: (id: string) => api.get(`/locations/${id}`),
  create: (data: any) => api.post('/locations', data),
  update: (id: string, data: any) => api.put(`/locations/${id}`, data),
  delete: (id: string) => api.delete(`/locations/${id}`),
};

export const ReviewsAPI = {
  getAll: () => api.get('/reviews'),
  getById: (id: string) => api.get(`/reviews/${id}`),
  create: (data: any) => api.post('/reviews', data),
  update: (id: string, data: any) => api.put(`/reviews/${id}`, data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
};

export const CustomersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const NFCCardsAPI = {
  getAll: () => api.get('/nfc-cards'),
  getById: (id: string) => api.get(`/nfc-cards/${id}`),
  create: (data: any) => api.post('/nfc-cards', data),
  update: (id: string, data: any) => api.put(`/nfc-cards/${id}`, data),
  delete: (id: string) => api.delete(`/nfc-cards/${id}`),
};

export default api;