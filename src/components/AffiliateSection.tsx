"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, ChevronRight, MousePointerClick, ShoppingCart, Package, TrendingUp } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { getAffiliateInfo } from "@/services/affiliateService";
import type { AffiliateInfo } from "@/types";

export default function AffiliateSection() {
  const { openSheet } = useUiStore();
  const [data, setData] = useState<AffiliateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getAffiliateInfo()
      .then(setData)
      .catch((e) => console.error("AffiliateSection error:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (!data) {
    return (
      <div className="mx-4 rounded-2xl bg-white border border-gray-100 shadow-sm px-4 py-4">
        <p className="text-sm text-gray-400 text-center">Tiếp thị liên kết chưa sẵn sàng</p>
      </div>
    );
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(data.affiliate_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const s = data.stats;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-4 rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
    >
      <button
        onClick={() => openSheet("affiliate")}
        className="w-full flex items-center justify-between px-4 pt-3.5 pb-2"
      >
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-amber-500" />
          <span className="text-sm font-bold text-gray-900">Tiếp thị liên kết</span>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </button>

      {/* Affiliate link */}
      <div className="px-4 pb-2">
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2">
          <code className="flex-1 text-[11px] text-gray-600 truncate">{data.affiliate_link}</code>
          <button
            onClick={copyLink}
            className="shrink-0 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-gray-400 hover:text-amber-600 border border-gray-200 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-0 border-t border-gray-50">
        <StatBox icon={<MousePointerClick className="h-4 w-4 text-amber-500" />} value={s.month_clicks} label="Click" />
        <StatBox icon={<ShoppingCart className="h-4 w-4 text-blue-500" />} value={s.month_orders} label="Đơn" />
        <StatBox icon={<Package className="h-4 w-4 text-emerald-500" />} value={s.month_quantity} label="SL" />
        <StatBox
          icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
          value={s.month_commission_expected.toLocaleString() + "đ"}
          label="HH"
          highlight
        />
      </div>
    </motion.div>
  );
}

function StatBox({ icon, value, label, highlight }: { icon: React.ReactNode; value: string | number; label: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center gap-0.5 py-3 ${highlight ? "bg-amber-50" : ""}`}>
      {icon}
      <span className={`text-sm font-bold ${highlight ? "text-amber-600" : "text-gray-900"}`}>{value}</span>
      <span className="text-[10px] text-gray-400">{label}</span>
    </div>
  );
}
