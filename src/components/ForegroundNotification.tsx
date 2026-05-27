"use client";

import { useEffect, useRef } from "react";
import { initFirebase, onForegroundMessage } from "@/lib/firebase";
import { toast } from "@/components/ui/toast";

export default function ForegroundNotification() {
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    initFirebase().then((ready) => {
      if (!ready) return;

      unsubRef.current = onForegroundMessage((payload: any) => {
        const d = payload?.data || {};
        const title = d.title || "SKV CTV";
        const body = d.body || d.message || "";

        toast(body || title, "info");
      });
    });

    return () => {
      unsubRef.current?.();
    };
  }, []);

  return null;
}
