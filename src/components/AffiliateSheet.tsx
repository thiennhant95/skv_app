"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ExternalLink, BarChart3, MousePointerClick, ShoppingCart, Package, TrendingUp, Globe } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { getAffiliateInfo } from "@/services/affiliateService";
import type { AffiliateInfo } from "@/types";

export default function AffiliateSheet() {
  const { activeSheet, closeSheet } = useUiStore();
  const open = activeSheet === "affiliate";
  const [data, setData] = useState<AffiliateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState("");
  const [copiedProductId, setCopiedProductId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const info = await getAffiliateInfo();
      setData(info);
    } catch {
      setError("Không thể tải thông tin");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchData();
  }, [open, fetchData]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(""), 2000);
    } catch {}
  };

  const stats = data?.stats;
  const topProducts = data?.top_products ?? [];
  const bySource = data?.by_source ?? [];

  return (
    <BottomSheet open={open} onClose={closeSheet} title="Tiếp thị liên kết">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <BarChart3 className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : !data ? null : (
        <div className="pb-4 space-y-4">
          {/* Affiliate Link */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-4">
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Link giới thiệu của bạn</p>
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
              <code className="flex-1 text-xs text-gray-700 truncate">{data.affiliate_link}</code>
              <button
                onClick={() => copyToClipboard(data.affiliate_link, "main")}
                className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 hover:bg-amber-200 transition-colors"
              >
                {copiedLink === "main" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
                <MousePointerClick className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{stats.month_clicks}</p>
                <p className="text-[10px] text-gray-400">Click</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
                <ShoppingCart className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{stats.month_orders}</p>
                <p className="text-[10px] text-gray-400">Đơn</p>
              </div>
              <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
                <Package className="h-4 w-4 text-emerald-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{stats.month_quantity}</p>
                <p className="text-[10px] text-gray-400">SL</p>
              </div>
              <div className="rounded-xl bg-amber-50 px-3 py-3 text-center">
                <TrendingUp className="h-4 w-4 text-amber-600 mx-auto mb-1" />
                <p className="text-lg font-bold text-amber-600">{stats.month_commission_expected.toLocaleString()}đ</p>
                <p className="text-[10px] text-gray-400">HH dự kiến</p>
              </div>
            </div>
          )}

          {/* Top Products */}
          {topProducts.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Sản phẩm được quan tâm</p>
              <div className="space-y-1.5">
                {topProducts.map((p, i) => (
                  <div key={p.product_id} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">{i + 1}</span>
                      <span className="text-sm font-medium text-gray-700 truncate">{p.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">{p.clicks} click</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Links */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Link theo sản phẩm</p>
            <div className="space-y-1.5">
              {data.products.map((p) => (
                <div key={p.id} className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2.5">
                  <code className="flex-1 text-[11px] text-gray-600 truncate">{p.affiliate_link}</code>
                  <button
                    onClick={() => copyToClipboard(p.affiliate_link, `prod-${p.id}`)}
                    className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-400 hover:text-amber-600 border border-gray-200 transition-colors"
                  >
                    {copiedProductId === p.id ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* By Source */}
          {bySource.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Nguồn truy cập</p>
              <div className="space-y-1.5">
                {bySource.map((s) => (
                  <div key={s.utm_source} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{s.utm_source}</span>
                    </div>
                    <span className="text-xs text-gray-400">{s.clicks} click</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
