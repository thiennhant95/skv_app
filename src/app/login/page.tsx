"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/home");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex gap-1.5">
          <div className="h-2 w-2 animate-bounce rounded-full bg-amber-400" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:0.1s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-amber-400 [animation-delay:0.2s]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LoginForm />
    </div>
  );
}
