"use client";

import { Bell, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useUiStore } from "@/store/uiStore";

export default function Header() {
  const { openSheet, unreadCount } = useUiStore();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between px-4 py-3"
      role="banner"
    >
      <div className="flex items-center gap-2" aria-label="SKV Member">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-sm">
          <span className="text-xs font-bold tracking-wider text-white" aria-hidden>
            SKV
          </span>
        </div>
        <span className="text-base font-semibold text-gray-900">SKV</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => openSheet("help")}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 transition-colors hover:bg-gray-100"
          aria-label="Hướng dẫn cài đặt"
        >
          <HelpCircle className="h-5 w-5 text-gray-500" aria-hidden />
        </button>

        <button
          onClick={() => openSheet("notifications")}
          className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 transition-colors hover:bg-gray-100"
          aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ""}`}
        >
          <Bell className="h-5 w-5 text-gray-600" aria-hidden />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
              aria-hidden
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </button>
      </div>
    </motion.header>
  );
}
