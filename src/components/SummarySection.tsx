"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, TrendingUp, Medal, ChevronRight } from "lucide-react";
import { getDashboard } from "@/services/dashboardService";
import { getCompetitionTop } from "@/services/competitionService";
import { useUiStore } from "@/store/uiStore";
import type { DashboardData, CompetitionItem } from "@/types";

const fallback: DashboardData = {
  totalProtandim: 0, totalImmucan: 0, totalKiddy: 0, totalCoffee: 0,
  totalFucoidan: 0, totalNuoc: 0, totalTaodo: 0, totalProvegan: 0,
  totalKiddyBox: 0, totalCoffeeBox: 0, totalFucoidanBox: 0, totalNuocBox: 0, totalTaodoBox: 0,
  totalDoanhSo: 0, totalAmount: 0,
  userFund: {
    total_personal_quantity: 0, total_system_quantity: 0, total_quantity: 0,
    fund_travel: 0, fund_reward: 0, fund_community: 0, total_fund: 0,
    paid_travel: 0, paid_reward: 0, paid_community: 0, paid_total: 0,
    remain_travel: 0, remain_reward: 0, remain_community: 0, remain_total: 0,
  },
};

const productConfig: Array<{ key: keyof DashboardData; label: string; unit: string }> = [
  { key: "totalProtandim", label: "Protandim", unit: "lọ" },
  { key: "totalImmucan", label: "Immucan", unit: "lọ" },
  { key: "totalCoffee", label: "Coffee", unit: "hộp" },
  { key: "totalKiddy", label: "Kiddy", unit: "hộp" },
  { key: "totalTaodo", label: "Táo đỏ", unit: "hộp" },
  { key: "totalProvegan", label: "Provegan", unit: "lọ" },
  { key: "totalNuoc", label: "Nước", unit: "hộp" },
  { key: "totalFucoidan", label: "Fucoidan", unit: "hộp" },
];

export default function SummarySection() {
  const { openSheet } = useUiStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [rankings, setRankings] = useState<CompetitionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboard().catch(() => fallback),
      getCompetitionTop(5, 0).catch(() => ({ items: [] as CompetitionItem[] })),
    ]).then(([dash, comp]) => {
      setDashboard(dash);
      setRankings(comp.items);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-4 grid grid-cols-2 gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-2.5 shadow-sm">
            <div className="h-6 w-6 animate-pulse rounded-lg bg-gray-200" />
            <div className="mt-2 h-3 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-1 h-7 w-16 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 space-y-1">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-3 w-full animate-pulse rounded bg-gray-200" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const d = dashboard || fallback;
  const personalQty = d.userFund.total_personal_quantity;
  const totalDoanhSo = d.totalDoanhSo;

  const products = productConfig
    .map((p) => ({ label: p.label, count: (d[p.key] as number) || 0, unit: p.unit }))
    .filter((p) => p.count > 0);

  return (
    <div className="mx-4 grid grid-cols-2 gap-2">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-2.5 shadow-sm"
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100">
            <Package className="h-3 w-3 text-emerald-600" />
          </div>
          <p className="text-[10px] font-medium text-gray-400">Cá nhân</p>
          <p className="ml-auto text-xl font-bold text-gray-900">
            {personalQty}
            <span className="ml-0.5 text-xs font-medium text-gray-400">lọ</span>
          </p>
        </div>

        <div className="flex items-center gap-2 border-t border-emerald-100/50 pt-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-100">
            <TrendingUp className="h-3 w-3 text-emerald-600" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] font-medium text-gray-400">Tổng doanh số</p>
            <p className="text-xl font-bold text-emerald-600">
              {totalDoanhSo.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-2 space-y-[1px]">
          {products.map((p) => (
            <div key={p.label} className="flex items-center justify-between rounded-lg px-1.5 py-0.5">
              <span className="text-xs text-gray-500">{p.label}</span>
              <span className="text-xs font-semibold text-gray-700">
                {p.count.toLocaleString()} {p.unit}
              </span>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-2">Chưa có dữ liệu</p>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-2.5 shadow-sm"
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-100">
            <Medal className="h-3 w-3 text-amber-600" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Top 5 xếp hạng</p>
        </div>

        <div className="space-y-1">
          {rankings.length > 0 ? rankings.map((member) => (
            <div key={member.rank} className="flex items-center gap-1.5 rounded-xl px-2.5 py-2">
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                member.rank === 1 ? "bg-yellow-400 text-white" :
                member.rank === 2 ? "bg-gray-300 text-white" :
                member.rank === 3 ? "bg-amber-700 text-white" :
                "bg-gray-100 text-gray-500"
              }`}>
                {member.rank}
              </span>
              {member.avatar && !member.avatar.includes("no-avatar") ? (
                <img src={member.avatar} alt="" className="h-4 w-4 rounded-full object-cover shrink-0" />
              ) : (
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500">
                  <span className="text-[5px] font-bold text-white">SKV</span>
                </div>
              )}
              <span className="flex-1 truncate text-xs font-medium text-gray-700">{member.username}</span>
              <span className="text-xs font-semibold text-emerald-600">{member.system_order_quantity_month.toLocaleString()}</span>
            </div>
          )) : (
            <p className="text-xs text-gray-400 text-center py-3">Chưa có dữ liệu</p>
          )}
        </div>

        <button
          onClick={() => openSheet("ranking")}
          className="mt-2 flex w-full items-center justify-center gap-1 rounded-xl bg-white/70 py-2.5 text-sm font-medium text-amber-600 backdrop-blur-sm transition-colors hover:bg-white/90"
        >
          Xem chi tiết
          <ChevronRight className="h-4 w-4" />
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="col-span-2 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-3 shadow-sm"
      >
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-100">
            <Package className="h-3 w-3 text-blue-600" />
          </div>
          <p className="text-sm font-semibold text-gray-700">Quỹ</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-white/60 p-2">
            <p className="text-[10px] font-medium text-gray-400">Du lịch</p>
            <p className="text-sm font-bold text-blue-600">
              {d.userFund.remain_travel.toLocaleString()} ₫
            </p>
          </div>
          <div className="rounded-xl bg-white/60 p-2">
            <p className="text-[10px] font-medium text-gray-400">Cuối năm</p>
            <p className="text-sm font-bold text-emerald-600">
              {d.userFund.remain_reward.toLocaleString()} ₫
            </p>
          </div>
          <div className="rounded-xl bg-white/60 p-2">
            <p className="text-[10px] font-medium text-gray-400">Cộng đồng</p>
            <p className="text-sm font-bold text-amber-600">
              {d.userFund.remain_community.toLocaleString()} ₫
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
