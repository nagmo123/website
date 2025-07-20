import { create } from 'zustand';
import { User } from '../types';
import { API_BASE_URL } from '../api/config';
import { useCartStore } from './useCartStore';
import { useWishlistStore } from './useWishlistStore';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchSession: () => Promise<void>;
}

const API_URL = `${API_BASE_URL}/api/auth`;

function setToken(token: string | null) {
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

function getToken() {
  return localStorage.getItem('token');
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      setToken(data.token);
      set({ user: data.user, isLoading: false });
      // Merge local cart after login
      await useCartStore.getState().mergeLocalCart();
      // Fetch backend cart to update UI immediately
      await useCartStore.getState().fetchCart();
      // Fetch wishlist after login
      await useWishlistStore.getState().fetchWishlist();
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },
  
  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setToken(data.token);
      set({ user: data.user, isLoading: false });
      // Fetch wishlist after registration
      await useWishlistStore.getState().fetchWishlist();
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },
  
  logout: () => {
    setToken(null);
    set({ user: null });
  },

  fetchSession: async () => {
    const token = getToken();
    if (!token) return set({ user: null });
    set({ isLoading: true });
    try {
      const res = await fetch(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Session expired');
      const user = await res.json();
      set({ user, isLoading: false });
      // Fetch cart and wishlist after session restore
      await useCartStore.getState().fetchCart();
      await useWishlistStore.getState().fetchWishlist();
    } catch {
      setToken(null);
      set({ user: null, isLoading: false });
    }
  },
}));