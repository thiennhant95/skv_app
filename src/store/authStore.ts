import { create } from "zustand";
import type { AuthState, User } from "@/types";

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token: string, user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("skv_token", token);
      localStorage.setItem("skv_user", JSON.stringify(user));
    }
    set({ token, user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("skv_token");
      localStorage.removeItem("skv_user");
    }
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("skv_token");
      const userStr = localStorage.getItem("skv_user");
      if (token && userStr) {
        try {
          const user: User = JSON.parse(userStr);
          set({ token, user, isAuthenticated: true, isLoading: false });
          return;
        } catch {
          localStorage.removeItem("skv_token");
          localStorage.removeItem("skv_user");
        }
      }
    }
    set({ token: null, user: null, isAuthenticated: false, isLoading: false });
  },
}));
