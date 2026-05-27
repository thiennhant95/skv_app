"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Clock, Loader2, ArrowLeft, Calendar, ChevronDown } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { getNotifications, markNotificationRead } from "@/services/notificationService";
import type { Notification } from "@/types";

export default function NotificationSheet() {
  const { activeSheet, closeSheet, setUnreadCount } = useUiStore();
  const open = activeSheet === "notifications";
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Notification | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchNotifications = useCallback(async (pg = 1, append = false) => {
    if (pg === 1) { setLoading(true); }
    setError("");
    try {
      const data = await getNotifications(pg);
      if (append) {
        setNotifications((prev) => [...prev, ...data.notifications]);
      } else {
        setNotifications(data.notifications);
      }
      setUnreadCount(data.unread_count);
      setTotal(data.total || 0);
      setPage(pg);
    } catch {
      setError("Không thể tải thông báo");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [setUnreadCount]);

  useEffect(() => {
    if (open) {
      setSelected(null);
      setPage(1);
      fetchNotifications(1);
    }
  }, [open, fetchNotifications]);

  const loadMore = async () => {
    setLoadingMore(true);
    await fetchNotifications(page + 1, true);
  };

  const handleMarkRead = async (id: number) => {
    try {
      await markNotificationRead(id);
      const fresh = await getNotifications(1);
      setNotifications(fresh.notifications);
      setUnreadCount(fresh.unread_count);
      setTotal(fresh.total || 0);
    } catch { /* silent */ }
  };

  const handleTap = async (notif: Notification) => {
    if (!notif.is_read) {
      await handleMarkRead(notif.id);
    }
    setSelected(notif);
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts * 1000);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} giờ trước`;
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${mins}`;
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts * 1000);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const mins = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${mins} - ${day}/${month}/${year}`;
  };

  return (
    <BottomSheet open={open} onClose={closeSheet} title={selected ? undefined : "Thông báo"}>
      {selected ? (
        <div className="pb-4">
          <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm font-medium text-amber-600 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </button>
          <div className="space-y-4">
            {selected.image && (
              <img src={selected.image} alt="" loading="lazy" className="w-full max-h-80 rounded-2xl object-contain bg-gray-100" />
            )}
            <div>
              <h2 className="text-lg font-bold text-gray-900 leading-snug">{selected.title}</h2>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                {formatDate(selected.created_at)}
              </div>
            </div>
            <div className="rounded-2xl bg-gray-50 p-4">
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{selected.message}</p>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Bell className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Bell className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">Chưa có thông báo nào</p>
        </div>
      ) : (
        <div className="pb-4">
          <div className="space-y-2">
            {notifications.map((notif, index) => (
              <motion.button
                key={notif.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => handleTap(notif)}
                className={`w-full text-left rounded-2xl p-4 transition-colors ${notif.is_read ? "bg-white" : "bg-amber-50/70"}`}
              >
                <div className="flex gap-3">
                  {notif.image && (
                    <img src={notif.image} alt="" loading="lazy" className="h-14 w-14 rounded-xl object-cover shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <h3 className="text-sm font-semibold text-gray-900 flex-1 line-clamp-1">{notif.title}</h3>
                      {!notif.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-amber-400" />}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                    <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                      <Clock className="h-3 w-3" />
                      {formatTime(notif.created_at)}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          {total > notifications.length && (
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-3 flex w-full items-center justify-center gap-1 rounded-xl bg-amber-50 py-2.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-100 disabled:opacity-50"
            >
              {loadingMore ? (
                <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Đang tải...</>
              ) : (
                <>Xem thêm ({notifications.length}/{total}) <ChevronDown className="h-3.5 w-3.5" /></>
              )}
            </button>
          )}
        </div>
      )}
    </BottomSheet>
  );
}
