"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { Users, Search, Loader2, ChevronDown } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { getReferralF1 } from "@/services/referralF1Service";
import type { ReferralF1Item } from "@/types";

export default function ReferralF1Sheet() {
  const { activeSheet, closeSheet } = useUiStore();
  const open = activeSheet === "referralF1";
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("skv_user");
      if (raw) setIsAdmin(JSON.parse(raw).role == 1);
    } catch {}
  }, []);

  const [items, setItems] = useState<ReferralF1Item[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const now = useMemo(() => new Date(), []);
  const [filterUsername, setFilterUsername] = useState("");
  const [filterMonth, setFilterMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"));
  const [filterYear, setFilterYear] = useState(String(now.getFullYear()));

  const buildParams = useCallback((p: number) => {
    const params: { page?: number; limit?: number; username?: string; from_date?: string } = {
      page: p,
      limit: 100,
    };
    if (isAdmin && filterUsername.trim()) {
      params.username = filterUsername.trim();
    }
    params.from_date = `${filterMonth}-${filterYear}`;
    return params;
  }, [isAdmin, filterUsername, filterMonth, filterYear]);

  const fetchData = useCallback(async (p: number, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError("");
    try {
      const data = await getReferralF1(buildParams(p));
      if (append) {
        setItems((prev) => [...prev, ...data.items]);
      } else {
        setItems(data.items);
      }
      setTotal(data.total);
      setPage(p);
    } catch {
      setError("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [buildParams]);

  const handleSearch = () => {
    fetchData(1);
  };

  useEffect(() => {
    if (open) {
      setItems([]);
      setTotal(0);
      setError("");
    }
  }, [open]);

  const loadMore = () => {
    if (!loadingMore && items.length < total) {
      fetchData(page + 1, true);
    }
  };

  const months = Array.from({ length: 12 }, (_, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: `Tháng ${i + 1}`,
  }));
  const years = Array.from({ length: 5 }, (_, i) => String(now.getFullYear() - i));

  const totalPersonal = items.reduce((sum, i) => sum + i.personal_quantity_month, 0);

  return (
    <BottomSheet open={open} onClose={closeSheet} title="Doanh số F1">
      <div className="flex items-center gap-2 mb-3">
          {isAdmin && (
            <div className="flex-1">
              <input
                type="text"
                value={filterUsername}
                onChange={(e) => setFilterUsername(e.target.value)}
                placeholder="Username"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs outline-none focus:border-amber-400 focus:bg-white"
              />
            </div>
          )}
        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs outline-none focus:border-amber-400 focus:bg-white"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>{m.label}</option>
          ))}
        </select>
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-2 text-xs outline-none focus:border-amber-400 focus:bg-white"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400 text-white"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Users className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Users className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">Bấm Search để xem doanh số F1</p>
        </div>
      ) : (
        <div className="pb-4">
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 mb-4">
            <span className="text-sm font-medium text-gray-600">Thành viên F1</span>
            <span className="text-lg font-bold text-amber-600">{total}</span>
          </div>
          <div className="space-y-2">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {item.username}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{item.fullname}</p>
                    <div className="mt-1 flex items-center gap-2">
                      {item.title && (
                        <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                          {item.title}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-400">{item.month}/{item.year}</span>
                    </div>
                  </div>
                  <div className="text-right ml-3 shrink-0">
                    <p className="text-lg font-bold text-amber-600">
                      {item.personal_quantity_month}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {total > items.length && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-white/70 py-2.5 text-xs font-medium text-amber-600 backdrop-blur-sm transition-colors hover:bg-white/90 disabled:opacity-50"
            >
              {loadingMore ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải...</>
              ) : (
                <>Xem thêm ({items.length}/{total}) <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </button>
          )}

          {totalPersonal > 0 && (
            <div className="mt-4 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Tổng doanh số F1</p>
              <p className="text-lg font-bold text-amber-600">{totalPersonal}</p>
            </div>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
