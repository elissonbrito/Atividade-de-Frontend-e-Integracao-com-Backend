import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: injeta token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: trata erros de autenticação globalmente
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

// ─── Services ─────────────────────────────────────────────────────────────────
export const carrosService = {
  list: (page = 1, limit = 10) => api.get(`/carros?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/carros/${id}`),
  create: (data) => api.post('/carros', data),
  update: (id, data) => api.put(`/carros/${id}`, data),
  remove: (id) => api.delete(`/carros/${id}`),
};

export const motosService = {
  list: (page = 1, limit = 10) => api.get(`/motos?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/motos/${id}`),
  create: (data) => api.post('/motos', data),
  update: (id, data) => api.put(`/motos/${id}`, data),
  remove: (id) => api.delete(`/motos/${id}`),
};

export const marcasRoupaService = {
  list: (page = 1, limit = 10) => api.get(`/marcas-roupa?page=${page}&limit=${limit}`),
  getById: (id) => api.get(`/marcas-roupa/${id}`),
  create: (data) => api.post('/marcas-roupa', data),
  update: (id, data) => api.put(`/marcas-roupa/${id}`, data),
  remove: (id) => api.delete(`/marcas-roupa/${id}`),
};

export const usersService = {
  list: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  remove: (id) => api.delete(`/users/${id}`),
};

export default api;
