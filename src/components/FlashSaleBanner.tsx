"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles } from "lucide-react";
import { getBanners } from "@/services/bannerService";
import type { Banner } from "@/types";

export default function FlashSaleBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    getBanners()
      .then((banners) => {
        if (banners.length > 0) setBanner(banners[0]);
      })
      .catch(() => setError(true));
  }, []);

  const displayTitle = banner?.title || "Flash Sale giảm 20% NRF2";
  const displayContent = banner?.content || "";

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
              <p className="text-[10px] text-white/80 truncate">{displayContent}</p>
            )}
          </div>
          {!banner?.image && <Sparkles className="h-4 w-4 text-white/40 shrink-0" />}
        </div>
      </a>
    </motion.div>
  );
}
