"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Award, Loader2, Star, ChevronDown } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { getCompetitionTop } from "@/services/competitionService";
import type { CompetitionItem } from "@/types";

const PAGE_SIZE = 15;

function getRankUI(rank: number) {
  if (rank === 1) return { cls: "bg-yellow-400 text-white", icon: <Trophy className="h-3.5 w-3.5 text-white" /> };
  if (rank === 2) return { cls: "bg-gray-300 text-white", icon: <Medal className="h-3.5 w-3.5 text-white" /> };
  if (rank === 3) return { cls: "bg-amber-700 text-white", icon: <Star className="h-3.5 w-3.5 text-white" /> };
  return { cls: "bg-gray-100 text-gray-500", icon: null };
}

export default function RankingSheet() {
  const { activeSheet, closeSheet } = useUiStore();
  const open = activeSheet === "ranking";
  const [items, setItems] = useState<CompetitionItem[]>([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const fetchRankings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCompetitionTop(PAGE_SIZE, 0);
      setItems(data.items);
      setTotal(data.total);
      setOffset(PAGE_SIZE);
    } catch {
      setError("Không thể tải bảng xếp hạng");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const data = await getCompetitionTop(PAGE_SIZE, offset);
      setItems((prev) => [...prev, ...data.items]);
      setOffset((prev) => prev + PAGE_SIZE);
    } catch { /* silent */ }
    finally { setLoadingMore(false); }
  };

  useEffect(() => {
    if (open) {
      setItems([]);
      setOffset(0);
      fetchRankings();
    }
  }, [open, fetchRankings]);

  const showing = items.length;

  return (
    <BottomSheet open={open} onClose={closeSheet} title="Bảng xếp hạng">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Trophy className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : (
        <div className="pb-4">
          <div className="flex items-center gap-2 mb-2 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 px-2.5 py-2">
            <Trophy className="h-5 w-5 text-amber-500 shrink-0" />
            <p className="text-sm text-gray-600">
              Xếp hạng thi đua tháng này · {total.toLocaleString()} người tham gia
            </p>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Trophy className="h-10 w-10 text-gray-300" />
              <p className="text-sm text-gray-400">Chưa có dữ liệu</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {items.map((member, index) => {
                const rank = member.rank;
                const ui = getRankUI(rank);
                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center gap-1.5 rounded-2xl px-2.5 py-2 bg-white"
                  >
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${ui.cls}`}>
                      {ui.icon || rank}
                    </div>
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      {member.avatar && !member.avatar.includes("no-avatar") ? (
                        <img src={member.avatar} alt="" className="h-5 w-5 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500">
                          <span className="text-[7px] font-bold text-white">SKV</span>
                        </div>
                      )}
                      <span className="text-xs font-semibold text-gray-900 truncate">{member.username}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-emerald-600">
                        {member.system_order_quantity_month.toLocaleString()}
                      </p>
                       <p className="text-[8px] text-gray-400">lọ</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {total > showing && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-amber-50 py-2.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-100 disabled:opacity-50"
            >
              {loadingMore ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải...</>
              ) : (
                <>Xem thêm ({showing}/{total}) <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </button>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
