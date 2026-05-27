"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { getBanners } from "@/services/bannerService";
import type { Banner } from "@/types";

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function FlashSaleBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBanners()
      .then((banners) => {
        if (banners.length > 0) {
          setBanner(banners[0]);
          if (banners[0].countdown && banners[0].countdown > 0) {
            setRemaining(banners[0].countdown);
          }
        }
      })
      .catch(() => setError(true));
  }, []);

  useEffect(() => {
    if (remaining === null || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [remaining]);

  const displayTitle = banner?.title || "Flash Sale giảm 20% NRF2";
  const displayContent = banner?.content || "";
  const countdownText = remaining !== null && remaining > 0 ? formatCountdown(remaining) : null;

  if (error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.4 }}
      className="mx-4 overflow-hidden rounded-2xl bg-gradient-to-r from-rose-500 via-rose-400 to-pink-500 shadow-lg shadow-rose-200/50"
    >
      <a
        href={banner?.link || "#"}
        target="_self"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            {banner?.image ? (
              <img src={banner.image} alt="" className="h-6 w-6 rounded object-cover" />
            ) : (
              <Clock className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{displayTitle}</p>
            {displayContent && (
              <p className="text-sm font-semibold text-white/90 mt-0.5">{displayContent}</p>
            )}
            {countdownText && (
              <p className="text-xs font-mono font-bold text-yellow-200 mt-1">
                {countdownText}
              </p>
            )}
          </div>
          {!banner?.image && <Sparkles className="h-4 w-4 text-white/40 shrink-0" />}
        </div>
      </a>
    </motion.div>
  );
}
