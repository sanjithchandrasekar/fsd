import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.login(credentials);
          localStorage.setItem('craftora_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (err) {
          const msg = err.response?.data?.message || 'Login failed';
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
          const { data } = await authAPI.register(userData);
          localStorage.setItem('craftora_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (err) {
          const msg = err.response?.data?.message || 'Registration failed';
          set({ error: msg, isLoading: false });
          throw new Error(msg);
        }
      },

      logout: () => {
        localStorage.removeItem('craftora_token');
        set({ user: null, token: null });
      },

      fetchMe: async () => {
        try {
          const { data } = await authAPI.getMe();
          set({ user: data.user });
        } catch {
          get().logout();
        }
      },

      toggleWishlist: async (productId) => {
        try {
          const { data } = await authAPI.toggleWishlist(productId);
          set((state) => ({
            user: { ...state.user, wishlist: data.wishlist },
          }));
          return data;
        } catch (err) {
          throw err;
        }
      },

      updateUser: (updates) => set((state) => ({ user: { ...state.user, ...updates } })),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'craftora_auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
