"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Bell, Gift, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store/uiStore";

const navItems: Array<{
  icon: typeof Home;
  label: string;
  labelEn: string;
  path: string | null;
  sheet: "notifications" | "promotions" | "profile" | null;
}> = [
  { icon: Home, label: "Trang chủ", labelEn: "Home", path: "/home", sheet: null },
  { icon: Bell, label: "Thông báo", labelEn: "Notifications", path: null, sheet: "notifications" },
  { icon: Gift, label: "Khuyến mãi", labelEn: "Promotions", path: null, sheet: "promotions" },
  { icon: User, label: "Cá nhân", labelEn: "Profile", path: null, sheet: "profile" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { openSheet, unreadCount } = useUiStore();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40" role="navigation" aria-label="Điều hướng chính">
      <div className="mx-auto max-w-md">
        <div className="mx-3 mb-0.5 rounded-2xl border border-gray-100/80 bg-white/90 px-2 shadow-lg shadow-gray-200/50 backdrop-blur-xl">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.path === pathname;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    if (item.sheet) {
                      openSheet(item.sheet);
                    } else if (item.path) {
                      window.location.href = item.path;
                    }
                  }}
                  aria-label={item.label}
                  aria-current={isActive ? "page" : undefined}
                  className={cn("relative flex flex-col items-center py-2", "min-w-[56px]")}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -top-0.5 h-0.5 w-6 rounded-full bg-amber-400"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <div className="relative">
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isActive ? "text-amber-500" : "text-gray-400"
                      )}
                      aria-hidden
                    />
                    {item.sheet === "notifications" && unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -right-1.5 -top-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[8px] font-bold text-white"
                        aria-label={`${unreadCount} thông báo chưa đọc`}
                      >
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </motion.span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-0.5 text-[10px] font-medium transition-colors",
                      isActive ? "text-amber-500" : "text-gray-400"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
