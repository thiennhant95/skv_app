"use client";

import { ToastProvider } from "@/components/ui/toast";
import ForegroundNotification from "@/components/ForegroundNotification";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ToastProvider />
      {children}
      <ForegroundNotification />
    </>
  );
}
