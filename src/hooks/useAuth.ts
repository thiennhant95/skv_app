"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const router = useRouter();
  const { isAuthenticated, isLoading, hydrate, logout } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const requireAuth = () => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  };

  const redirectIfAuth = () => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return {
    isAuthenticated,
    isLoading,
    requireAuth,
    redirectIfAuth,
    logout: handleLogout,
  };
}
