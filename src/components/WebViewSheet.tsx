"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useUiStore } from "@/store/uiStore";

export default function WebViewSheet() {
  const { webviewUrl, closeWebview } = useUiStore();
  const [loading, setLoading] = useState(true);

  const url = webviewUrl ? new URL(webviewUrl) : null;
  const domain = url?.hostname ?? "";
  const type = url?.searchParams.get("type") ?? "";

  const title =
    type === "muasi"
      ? "Mua hàng sỉ"
      : type === "muale"
      ? "Mua hàng lẻ"
      : domain === "protandimnrf2.vn"
      ? "Quản lý đơn hàng & Doanh số"
      : domain;

  return (
    <AnimatePresence>
      {webviewUrl && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
          <div className="flex-1 relative bg-white">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                  <p className="text-sm text-gray-400">Đang tải...</p>
                </div>
              </div>
            )}
            <iframe
              src={webviewUrl}
              className="w-full h-full border-0"
              onLoad={() => setLoading(false)}
              title={title}
            />
            <button
              onClick={closeWebview}
              className="absolute top-12 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg text-gray-800 backdrop-blur-sm active:scale-95 transition-transform"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
