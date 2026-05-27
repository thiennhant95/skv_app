"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { useUiStore } from "@/store/uiStore";

export default function WebViewSheet() {
  const { webviewUrl, closeWebview } = useUiStore();
  const [loading, setLoading] = useState(true);

  const openInBrowser = () => {
    if (webviewUrl) window.open(webviewUrl, "_blank");
  };

  const domain = webviewUrl ? new URL(webviewUrl).hostname : "";

  const title =
    domain === "suckhoevangpro.vn"
      ? "Mua hàng sỉ"
      : domain === "tinhhoabiolife.vn"
      ? "Mua hàng lẻ"
      : domain === "protandimnrf2.vn"
      ? "Quản lý đơn hàng & Doanh số"
      : domain;

  return (
    <AnimatePresence>
      {webviewUrl && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-white">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white safe-top"
          >
            <button
              onClick={closeWebview}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{title}</p>
              <p className="text-[10px] text-gray-400 truncate">{domain}</p>
            </div>
            <button
              onClick={openInBrowser}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Mở trong trình duyệt"
            >
              <ExternalLink className="h-4 w-4 text-gray-700" />
            </button>
          </motion.div>

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
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
