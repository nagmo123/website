import { create } from 'zustand';
import { CartItem, Product } from '../types';
import { API_BASE_URL } from '../api/config';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addItem: (product: Product, quantity?: number, options?: Partial<CartItem>) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const API_URL = `${API_BASE_URL}/api/cart`;
function getToken() {
  return localStorage.getItem('token');
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  fetchCart: async () => {
    const token = getToken();
    if (!token) return set({ items: [] });
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return set({ items: [] });
    const cart = await res.json();
    set({ items: (cart.items || []).map((item: any) => ({
      ...item,
      id: item._id,
    })) });
  },

  addItem: async (product, quantity = 1, options = {}) => {
    const token = getToken();
    if (!token) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id || product._id,
        quantity,
        selectedColor: options.selectedColor,
        selectedMaterial: options.selectedMaterial,
      }),
    });
    await get().fetchCart();
  },

  removeItem: async (id) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().fetchCart();
  },

  updateQuantity: async (id, quantity) => {
    const token = getToken();
    if (!token) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    await get().fetchCart();
  },

  clearCart: async () => {
    const token = getToken();
    if (!token) return;
    await fetch(API_URL, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    await get().fetchCart();
  },

  toggleCart: () => {
    set(state => ({ isOpen: !state.isOpen }));
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },
}));