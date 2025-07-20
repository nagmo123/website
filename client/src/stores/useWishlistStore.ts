import { create } from 'zustand';
import { Product } from '../types';
import { API_BASE_URL } from '../api/config';

interface WishlistStore {
  items: Product[];
  isOpen: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  toggleWishlist: () => void;
  isInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
}

const API_URL = `${API_BASE_URL}/api/wishlist`;

function getToken() {
  return localStorage.getItem('token');
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isOpen: false,

  fetchWishlist: async () => {
    const token = getToken();
    if (!token) {
      // Restore wishlist from localStorage if present
      const localWishlist = localStorage.getItem('wishlist');
      if (localWishlist) {
        set({ items: JSON.parse(localWishlist) });
      } else {
        set({ items: [] });
      }
      return;
    }
    
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return set({ items: [] });
      const products = await res.json();
      set({ items: products || [] });
      // Clear localStorage wishlist after successful fetch
      localStorage.removeItem('wishlist');
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      set({ items: [] });
    }
  },

  addToWishlist: async (product) => {
    const token = getToken();
    if (!token) {
      // Save to localStorage wishlist if not logged in
      const current = get().items;
      const existing = current.find(item => item.id === (product.id || product._id));
      if (!existing) {
        const newItems = [...current, product];
        set({ items: newItems });
        localStorage.setItem('wishlist', JSON.stringify(newItems));
      }
      return;
    }

    try {
      await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id || product._id,
        }),
      });
      // Always fetch the full wishlist after add
      await get().fetchWishlist();
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  },

  removeFromWishlist: async (productId) => {
    const token = getToken();
    if (!token) {
      // Remove from localStorage wishlist if not logged in
      const current = get().items;
      const newItems = current.filter(item => item.id !== productId && item._id !== productId);
      set({ items: newItems });
      localStorage.setItem('wishlist', JSON.stringify(newItems));
      return;
    }

    try {
      await fetch(`${API_URL}/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      // Always fetch the full wishlist after remove
      await get().fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  },

  clearWishlist: async () => {
    const token = getToken();
    if (!token) {
      set({ items: [] });
      localStorage.removeItem('wishlist');
      return;
    }

    try {
      await fetch(API_URL, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      await get().fetchWishlist();
    } catch (error) {
      console.error('Error clearing wishlist:', error);
    }
  },

  toggleWishlist: () => {
    set(state => ({ isOpen: !state.isOpen }));
  },

  isInWishlist: (productId) => {
    return get().items.some(item => item.id === productId || item._id === productId);
  },

  getTotalItems: () => {
    return get().items.length;
  },
})); 