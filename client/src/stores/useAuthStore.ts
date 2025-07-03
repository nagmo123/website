import { create } from 'zustand';
import { User } from '../types';

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email,
      role: 'customer',
    };
    
    set({ user: mockUser, isLoading: false });
  },
  
  register: async (name, email, password) => {
    set({ isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser: User = {
      id: '2',
      name,
      email,
      role: 'customer',
    };
    
    set({ user: mockUser, isLoading: false });
  },
  
  logout: () => {
    set({ user: null });
  },
}));