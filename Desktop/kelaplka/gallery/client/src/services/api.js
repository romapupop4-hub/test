import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data)
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

export const stylesAPI = {
  getAll: () => api.get('/styles'),
  getById: (id) => api.get(`/styles/${id}`),
  create: (data) => api.post('/styles', data),
  update: (id, data) => api.put(`/styles/${id}`, data),
  delete: (id) => api.delete(`/styles/${id}`)
};

export const componentsAPI = {
  getAll: (params) => api.get('/components', { params }),
  getById: (id) => api.get(`/components/${id}`),
  create: (data) => api.post('/components', data),
  update: (id, data) => api.put(`/components/${id}`, data),
  delete: (id) => api.delete(`/components/${id}`),
  getByCategory: (categoryId) => api.get(`/components/category/${categoryId}`),
  getByStyle: (styleId) => api.get(`/components/style/${styleId}`),
  incrementView: (id) => api.post(`/components/${id}/view`)
};

export const searchAPI = {
  search: (query) => api.get('/search', { params: { q: query } }),
  advancedSearch: (params) => api.get('/search/advanced', { params })
};

export const favoritesAPI = {
  getAll: () => api.get('/favorites'),
  add: (componentId) => api.post('/favorites', { componentId }),
  remove: (componentId) => api.delete(`/favorites/${componentId}`),
  check: (componentId) => api.get(`/favorites/check/${componentId}`)
};

export const usersAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  getStats: (id) => api.get(`/users/${id}/stats`)
};

export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data)
};

export default api;
