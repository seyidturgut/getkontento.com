/// <reference types="vite/client" />

import { create } from 'zustand';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        set({
          isLoading: false,
          error: data.message || 'Giriş başarısız'
        });
        return false;
      }

      // Successful login
      set({
        isAuthenticated: true,
        isLoading: false,
        token: data.token,
        user: data.user
      });

      // Store token in localStorage
      localStorage.setItem('auth_token', data.token);

      return true;
    } catch (error) {
      set({
        isLoading: false,
        error: 'Bağlantı hatası oluştu'
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  setToken: (token) => {
    localStorage.setItem('auth_token', token);
    set({ token });
  }
}));