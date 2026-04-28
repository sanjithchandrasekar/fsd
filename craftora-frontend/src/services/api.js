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

// ── Mock Product Helper ───────────────────
const transformProduct = (product) => ({
  ...product,
  seller: {
    name: typeof product.seller === 'string' ? product.seller : product.seller?.name,
    avatar: { url: `https://placehold.co/50x50/F2EBE0/C1693A?text=${(typeof product.seller === 'string' ? product.seller : product.seller?.name)[0]}` },
    location: 'India',
    isVerified: true
  }
});

const filterMockProducts = (params = {}) => {
  let filtered = [...mockProducts];

  // Filter by search
  if (params.search) {
    const query = params.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.seller.toLowerCase().includes(query)
    );
  }

  // Filter by category
  if (params.category) {
    filtered = filtered.filter(p => p.category === params.category);
  }

  // Filter by price
  if (params.minPrice) {
    filtered = filtered.filter(p => p.price >= params.minPrice);
  }
  if (params.maxPrice) {
    filtered = filtered.filter(p => p.price <= params.maxPrice);
  }

  // Filter by rating
  if (params.minRating) {
    filtered = filtered.filter(p => p.averageRating >= params.minRating);
  }

  // Filter by sustainable
  if (params.isSustainable === 'true') {
    filtered = filtered.filter(p => p.isSustainable);
  }

  // Filter by customizable
  if (params.isCustomizable === 'true') {
    filtered = filtered.filter(p => p.isCustomizable);
  }

  // Sort
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'createdAt':
      default:
        // Keep original order
        break;
    }
  }

  // Pagination
  const page = params.page || 1;
  const limit = params.limit || 12;
  const startIdx = (page - 1) * limit;
  const endIdx = startIdx + limit;
  const paginated = filtered.slice(startIdx, endIdx);

  return {
    products: paginated.map(transformProduct),
    pagination: {
      total: filtered.length,
      page,
      limit,
      pages: Math.ceil(filtered.length / limit),
    },
  };
};

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
  getAll: (params) => {
    const filtered = filterMockProducts(params);
    return Promise.resolve({
      data: {
        products: filtered.products,
        pagination: filtered.pagination
      }
    });
  },
  getFeatured: () => Promise.resolve({
    data: {
      featured: mockProducts
        .filter(p => p.averageRating >= 4.7)
        .sort(() => Math.random() - 0.5)
        .slice(0, 8)
        .map(transformProduct)
    }
  }),
  getById: (id) => Promise.resolve({
    data: {
      product: transformProduct(mockProducts.find(p => p._id === id) || mockProducts[0])
    }
  }),
  getByCategory: (cat, params) => {
    const filtered = filterMockProducts({ ...params, category: cat });
    return Promise.resolve({
      data: {
        products: filtered.products,
        pagination: filtered.pagination
      }
    });
  },
  getSellerProducts: (sellerId) => Promise.resolve({
    data: { products: mockProducts.filter(p => p.seller === sellerId).map(transformProduct) }
  }),
  create: (formData) => API.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => API.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/products/${id}`),
  addReview: (id, data) => API.post(`/products/${id}/reviews`, data),
  searchSuggestions: (q) => Promise.resolve({
    data: mockProducts
      .filter(p => p.title.toLowerCase().includes(q.toLowerCase()))
      .slice(0, 5)
      .map(p => ({ _id: p._id, title: p.title }))
  }),
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
