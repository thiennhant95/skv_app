"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Gift, Loader2, ExternalLink, Newspaper, Tag, ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { getPromotions } from "@/services/promotionService";
import { getNews, type NewsItem } from "@/services/newsService";
import { buildExternalUrl } from "@/lib/externalLink";
import type { Promotion } from "@/types";

export default function PromotionSheet() {
  const { activeSheet, closeSheet, openWebview } = useUiStore();
  const open = activeSheet === "promotions";
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [promoPage, setPromoPage] = useState(1);
  const [newsPage, setNewsPage] = useState(1);
  const [promoTotal, setPromoTotal] = useState(0);
  const [newsTotal, setNewsTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState<"promo" | "news" | null>(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<{ item: Promotion | NewsItem; type: "promotion" | "news" } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [promoData, newsData] = await Promise.all([
        getPromotions(1),
        getNews(1),
      ]);
      setPromotions(promoData.items);
      setPromoTotal(promoData.total);
      setPromoPage(1);
      setNewsItems(newsData.items);
      setNewsTotal(newsData.total);
      setNewsPage(1);
    } catch {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = async (type: "promo" | "news") => {
    setLoadingMore(type);
    try {
      if (type === "promo") {
        const next = promoPage + 1;
        const data = await getPromotions(next);
        setPromotions((prev) => [...prev, ...data.items]);
        setPromoPage(next);
      } else {
        const next = newsPage + 1;
        const data = await getNews(next);
        setNewsItems((prev) => [...prev, ...data.items]);
        setNewsPage(next);
      }
    } catch { /* silent */ }
    finally { setLoadingMore(null); }
  };

  useEffect(() => {
    if (open) {
      setSelected(null);
      fetchData();
    }
  }, [open, fetchData]);

  const formatDate = (ts: number) => {
    const d = new Date(ts * 1000);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const detail = selected ? (
    <div className="pb-4">
      <button
        onClick={() => setSelected(null)}
        className="flex items-center gap-2 text-sm font-medium text-amber-600 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại danh sách
      </button>

      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 leading-snug">
          {selected.item.title}
        </h2>

        <div className="flex items-center gap-2 text-[11px] text-gray-400">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate("created_at" in selected.item ? selected.item.created_at : 0)}
          <span className="ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium text-white bg-rose-400">
            {selected.type === "promotion" ? "Khuyến mãi" : "Tin tức"}
          </span>
        </div>

        {selected.item.image && (
          <img
            src={selected.item.image}
            alt={selected.item.title}
            loading="lazy"
            className="w-full max-h-80 rounded-2xl object-contain bg-gray-100"
          />
        )}

        <div
          className="rounded-2xl bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line [&_img]:hidden [&_h1]:text-base [&_h2]:text-sm [&_p]:mb-2"
          dangerouslySetInnerHTML={{
            __html: ("content" in selected.item ? selected.item.content : "") ||
                    ("excerpt" in selected.item ? selected.item.excerpt : "") ||
                    selected.item.title
          }}
        />

        {"slug" in selected.item && selected.item.slug && (
          <button
            onClick={() => {
              closeSheet();
              openWebview(buildExternalUrl("protandimnrf2.vn", undefined, `${selected.type}s/${selected.item.slug}`));
            }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 py-3 text-sm font-semibold text-white shadow-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Xem trên web
          </button>
        )}
      </div>
    </div>
  ) : null;

  return (
    <BottomSheet open={open} onClose={closeSheet} title={selected ? undefined : "Khuyến mãi & Tin tức"}>
      {selected ? detail : loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Gift className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : promotions.length === 0 && newsItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Gift className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
        </div>
      ) : (
        <div className="space-y-6 pb-4">
          {promotions.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-rose-500" />
                <h3 className="text-sm font-bold text-gray-700">Khuyến mãi</h3>
              </div>
              <div className="space-y-3">
                {promotions.map((item, index) => (
                  <motion.div
                    key={`promo-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="overflow-hidden rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 shadow-sm"
                  >
                    <div className="p-3.5">
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      {item.excerpt && <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>}
                      <button
                        onClick={() => setSelected({ item, type: "promotion" })}
                        className="mt-2 flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-2 text-xs font-semibold text-white shadow-sm"
                      >
                        Xem chi tiết
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {promoTotal > promotions.length && (
                <button
                  onClick={() => loadMore("promo")}
                  disabled={loadingMore === "promo"}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-white/70 py-2.5 text-xs font-medium text-amber-600 backdrop-blur-sm transition-colors hover:bg-white/90 disabled:opacity-50"
                >
                  {loadingMore === "promo" ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải...</>
                  ) : (
                    <>Xem thêm <ChevronDown className="h-3.5 w-3.5" /></>
                  )}
                </button>
              )}
            </section>
          )}

          {newsItems.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Newspaper className="h-4 w-4 text-sky-500" />
                <h3 className="text-sm font-bold text-gray-700">Tin tức</h3>
              </div>
              <div className="space-y-3">
                {newsItems.map((item, index) => (
                  <motion.div
                    key={`news-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="overflow-hidden rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 shadow-sm"
                  >
                    <div className="p-3.5">
                      <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                      {item.excerpt && <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{item.excerpt}</p>}
                      <button
                        onClick={() => setSelected({ item, type: "news" })}
                        className="mt-2 flex items-center gap-1 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 px-3 py-2 text-xs font-semibold text-white shadow-sm"
                      >
                        Xem chi tiết
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
              {newsTotal > newsItems.length && (
                <button
                  onClick={() => loadMore("news")}
                  disabled={loadingMore === "news"}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-white/70 py-2.5 text-xs font-medium text-sky-600 backdrop-blur-sm transition-colors hover:bg-white/90 disabled:opacity-50"
                >
                  {loadingMore === "news" ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải...</>
                  ) : (
                    <>Xem thêm <ChevronDown className="h-3.5 w-3.5" /></>
                  )}
                </button>
              )}
            </section>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
