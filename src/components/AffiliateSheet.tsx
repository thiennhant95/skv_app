"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Copy, Check, BarChart3, MousePointerClick, ShoppingCart, Package, TrendingUp, Globe, DollarSign, ChevronDown, History } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { getAffiliateInfo, getCommissionHistory } from "@/services/affiliateService";
import type { AffiliateInfo, CommissionItem } from "@/types";

export default function AffiliateSheet() {
  const { activeSheet, closeSheet } = useUiStore();
  const open = activeSheet === "affiliate";
  const [data, setData] = useState<AffiliateInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedLink, setCopiedLink] = useState("");
  const [copiedProductId, setCopiedProductId] = useState<number | null>(null);
  const [history, setHistory] = useState<CommissionItem[]>([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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

  const fetchHistory = useCallback(async (append = false) => {
    setLoadingHistory(true);
    try {
      const offset = append ? historyOffset : 0;
      const res = await getCommissionHistory(20, offset);
      if (append) {
        setHistory((prev) => [...prev, ...res.items]);
      } else {
        setHistory(res.items);
      }
      setHistoryTotal(res.total);
      setHistoryOffset(offset + res.items.length);
    } catch {}
    setLoadingHistory(false);
  }, [historyOffset]);

  useEffect(() => {
    if (open) {
      fetchData();
      setHistory([]);
      setHistoryOffset(0);
    }
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

  const conversionClickToOrder = stats && stats.total_clicks > 0
    ? ((stats.total_orders / stats.total_clicks) * 100).toFixed(1)
    : "0.0";

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

          {/* Stats - This month */}
          {stats && (
            <>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1">Tháng này</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
                  <MousePointerClick className="h-4 w-4 text-amber-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{stats.month_clicks}</p>
                  <p className="text-[10px] text-gray-400">Click</p>
                </div>
                <div className="rounded-xl bg-gray-50 px-3 py-3 text-center">
                  <ShoppingCart className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900">{stats.month_add_to_cart}</p>
                  <p className="text-[10px] text-gray-400">Giỏ hàng</p>
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

              {/* Conversion rate */}
              <div className="rounded-xl bg-gray-50 px-4 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">Tỷ lệ chuyển đổi (click → đơn)</span>
                <span className="text-sm font-bold text-emerald-600">{conversionClickToOrder}%</span>
              </div>

              {/* Total Stats */}
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide px-1">Tổng quan</p>
              <div className="grid grid-cols-4 gap-2">
                <div className="rounded-xl bg-gray-100/50 px-3 py-2.5 text-center">
                  <p className="text-sm font-bold text-gray-900">{stats.total_clicks}</p>
                  <p className="text-[9px] text-gray-400">Click</p>
                </div>
                <div className="rounded-xl bg-gray-100/50 px-3 py-2.5 text-center">
                  <p className="text-sm font-bold text-gray-900">{stats.total_orders}</p>
                  <p className="text-[9px] text-gray-400">Đơn</p>
                </div>
                <div className="rounded-xl bg-gray-100/50 px-3 py-2.5 text-center">
                  <p className="text-sm font-bold text-gray-900">{stats.total_quantity}</p>
                  <p className="text-[9px] text-gray-400">SL</p>
                </div>
                <div className="rounded-xl bg-amber-50 px-3 py-2.5 text-center">
                  <p className="text-sm font-bold text-amber-600">{stats.total_commission_paid.toLocaleString()}đ</p>
                  <p className="text-[9px] text-gray-400">Đã nhận</p>
                </div>
              </div>

              {/* Commission paid this month */}
              {stats.month_commission_paid > 0 && (
                <div className="rounded-xl bg-emerald-50 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-emerald-500" />
                    <span className="text-sm text-gray-600">Hoa hồng tháng này</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-600">{stats.month_commission_paid.toLocaleString()}đ</span>
                </div>
              )}
            </>
          )}

          {/* Commission History */}
          <div>
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory && history.length === 0) fetchHistory();
              }}
              className="flex items-center justify-between w-full px-1 py-2"
            >
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-gray-500" />
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Lịch sử trả thưởng</span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${showHistory ? "rotate-180" : ""}`} />
            </button>
            {showHistory && (
              <div className="space-y-1.5 mt-1">
                {history.length === 0 && !loadingHistory ? (
                  <p className="text-xs text-gray-400 text-center py-4">Chưa có giao dịch</p>
                ) : (
                  history.map((item, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-gray-700 truncate">{item.message}</p>
                        <p className="text-[10px] text-gray-400">{new Date(item.created_at * 1000).toLocaleDateString("vi-VN")}</p>
                      </div>
                      <span className="text-sm font-bold text-emerald-600 shrink-0 ml-2">+{item.amount.toLocaleString()}đ</span>
                    </div>
                  ))
                )}
                {loadingHistory && (
                  <div className="flex justify-center py-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
                  </div>
                )}
                {historyTotal > history.length && !loadingHistory && (
                  <button
                    onClick={() => fetchHistory(true)}
                    className="w-full text-center text-xs text-amber-600 py-2"
                  >
                    Xem thêm ({history.length}/{historyTotal})
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Top Products */}
          {topProducts.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Sản phẩm được quan tâm</p>
              <div className="space-y-1.5">
                {topProducts.map((p, i) => (
                  <div key={p.product_id} className="rounded-xl bg-gray-50 px-3 py-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">{i + 1}</span>
                        <span className="text-sm font-medium text-gray-700 truncate">{p.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 pl-7">
                      <span className="text-[11px] text-gray-400"><span className="font-semibold text-gray-600">{p.clicks}</span> click</span>
                      <span className="text-[11px] text-gray-400"><span className="font-semibold text-blue-500">{p.add_to_cart}</span> giỏ</span>
                      <span className="text-[11px] text-gray-400"><span className="font-semibold text-emerald-500">{p.orders}</span> đơn</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Links */}
          <div>
            <p className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Link theo sản phẩm</p>
            <div className="space-y-2">
              {data.products.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
                  <div className="shrink-0 h-10 w-10 rounded-lg bg-white overflow-hidden flex items-center justify-center border border-gray-100">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-5 w-5 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                    <code className="text-[10px] text-gray-400 truncate block">{p.affiliate_link}</code>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(p.affiliate_link);
                      setCopiedProductId(p.id);
                      setTimeout(() => setCopiedProductId(null), 2000);
                    }}
                    className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-gray-400 hover:text-amber-600 border border-gray-200 transition-colors"
                  >
                    {copiedProductId === p.id ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
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
