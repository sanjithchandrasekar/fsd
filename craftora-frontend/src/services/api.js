import axios from 'axios';
import { mockProducts } from '../data/mockProducts';

const API = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('craftora_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('craftora_token');
      localStorage.removeItem('craftora_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── Auth ──────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  toggleWishlist: (productId) => API.post(`/auth/wishlist/${productId}`),
  becomeSeller: () => API.post('/auth/become-seller'),
};

// ── Products ──────────────────────────────
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getFeatured: () => API.get('/products/featured'),
  getById: (id) => API.get(`/products/${id}`),
  getByCategory: (category, params) => API.get(`/products`, { params: { ...params, category } }),
  getSellerProducts: (sellerId) => API.get(`/products/seller/${sellerId}`),
  create: (formData) => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
  addReview: (id, data) => API.post(`/products/${id}/reviews`, data),
  searchSuggestions: (q) => API.get('/products/search/suggestions', { params: { q } }),
};

// ── Orders ────────────────────────────────
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getById: (id) => API.get(`/orders/${id}`),
  createPaymentIntent: (amount) => API.post('/orders/create-payment-intent', { amount }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

// ── Feed ─────────────────────────────────
export const feedAPI = {
  getPosts: (page = 1) => API.get('/feed', { params: { page } }),
  createPost: (formData) => API.post('/feed', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleLike: (id) => API.post(`/feed/${id}/like`),
};

// ── Custom Orders ─────────────────────────
export const customOrderAPI = {
  create: (data) => API.post('/custom-orders', data),
  getAll: () => API.get('/custom-orders'),
  update: (id, data) => API.put(`/custom-orders/${id}`, data),
};

// ── Messaging ─────────────────────────────
export const chatAPI = {
  getConversations: () => API.get('/conversations'),
  getMessages: (convId) => API.get(`/conversations/${convId}/messages`),
  sendMessage: (data) => API.post('/messages', data),
};

// ── Admin ─────────────────────────────────
export const adminAPI = {
  getAnalytics: () => API.get('/analytics'),
  getUsers: (params) => API.get('/users', { params }),
  updateUser: (id, data) => API.put(`/users/${id}`, data),
  getProducts: (status) => API.get('/products', { params: { status } }),
  updateProductStatus: (id, status) => API.put(`/products/${id}/status`, { status }),
  getOrders: (params) => API.get('/orders/admin/all', { params }),
  getLeaderboard: () => API.get('/leaderboard'),
};

export default API;
