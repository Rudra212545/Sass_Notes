import axios from 'axios';


const API_BASE_URL ='https://saas-notes-backend-9996wqi4y-rudra212545s-projects.vercel.app/api';

console.log(API_BASE_URL);
// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
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

// API functions - these will now correctly call /api/auth/login, /api/notes, etc.
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData), 
};

export const notesAPI = {
  getAll: () => api.get('/notes'),           // -> /api/notes
  create: (note) => api.post('/notes', note),   // -> /api/notes
  update: (id, note) => api.put(`/notes/${id}`, note), // -> /api/notes/:id
  delete: (id) => api.delete(`/notes/${id}`),   // -> /api/notes/:id
};

export const tenantsAPI = {
  upgrade: (slug) => api.post(`/tenants/${slug}/upgrade`), // -> /api/tenants/:slug/upgrade
};

export default api;
