import { create } from 'zustand';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === 'demo@sistemglobal.com' && password === 'Demo123!') {
      set({
        isAuthenticated: true,
        isLoading: false,
        user: {
          id: '1',
          name: 'GetKontento Admin',
          email: email,
          role: 'admin',
        },
      });
      return true;
    } else {
      set({
        isLoading: false,
        error: 'E-posta veya şifre hatalı. Lütfen tekrar deneyiniz.',
      });
      return false;
    }
  },

  logout: () => set({ user: null, isAuthenticated: false }),
  
  clearError: () => set({ error: null }),
}));