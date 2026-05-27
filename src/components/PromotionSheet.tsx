"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, ExternalLink } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { getPromotions } from "@/services/promotionService";
import { buildExternalUrl } from "@/lib/externalLink";
import type { Promotion } from "@/types";

export default function PromotionSheet() {
  const { activeSheet, closeSheet, openWebview } = useUiStore();
  const open = activeSheet === "promotions";
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPromotions = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPromotions();
      setPromotions(data.items);
    } catch {
      setError("Không thể tải khuyến mãi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchPromotions();
  }, [open, fetchPromotions]);

  const handleCta = (item: Promotion) => {
    if (item.slug) {
      closeSheet();
      openWebview(buildExternalUrl("protandimnrf2.vn", undefined, `promotions/${item.slug}`));
    }
  };

  return (
    <BottomSheet open={open} onClose={closeSheet} title="Khuyến mãi">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Gift className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : promotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Gift className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">Chưa có chương trình khuyến mãi</p>
        </div>
      ) : (
        <div className="space-y-4 pb-4">
          {promotions.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 shadow-sm"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                {item.excerpt && (
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">{item.excerpt}</p>
                )}
                <button
                  onClick={() => handleCta(item)}
                  className="mt-3 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                  Xem chi tiết
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
