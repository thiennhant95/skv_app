"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw, RotateCcw } from "lucide-react";

export default function UpdateNotification() {
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then((reg) => {
      if (reg.waiting) {
        setWaitingWorker(reg.waiting);
        setShow(true);
      }

      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setWaitingWorker(newWorker);
              setShow(true);
            }
          });
        }
      });
    });
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: "SKIP_WAITING" });
    }
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          className="fixed bottom-24 left-0 right-0 z-50 px-4"
        >
          <div className="mx-auto max-w-md rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 shadow-xl shadow-amber-200/50 px-4 py-3 flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <RotateCcw className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white">Phiên bản mới đã có</p>
              <p className="text-xs text-white/80">Nhấn để cập nhật trải nghiệm</p>
            </div>
            <button
              onClick={handleUpdate}
              className="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Cập nhật
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
