"use client";

import { motion } from "framer-motion";
import { User } from "@/types";

interface UserSummaryCardProps {
  user: User;
}

export default function UserSummaryCard({ user }: UserSummaryCardProps) {
  const discountText = user.discount_percent > 0 ? `${user.discount_percent}%` : "0%";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="mx-4 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 px-4 py-3 shadow-sm"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <p className="text-sm text-gray-500 whitespace-nowrap">Xin chào,</p>
          <p className="text-base font-bold text-gray-900 truncate">{user.fullname || user.username}</p>
          <span className="inline-block rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm whitespace-nowrap shrink-0">
            {user.title || `Level ${user.level}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl bg-white/70 px-3 py-1.5 backdrop-blur-sm whitespace-nowrap shrink-0">
          <span className="text-xs text-gray-500">Chiết khấu:</span>
          <span className="text-sm font-bold text-amber-600">{discountText}</span>
        </div>
      </div>
    </motion.div>
  );
}
