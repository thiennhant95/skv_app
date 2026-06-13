"use client";

import { motion } from "framer-motion";
import {
  PackageSearch,
  ShoppingBag,
  ClipboardList,
  Gift,
} from "lucide-react";
import { buildExternalUrl } from "@/lib/externalLink";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";

const actions = [
  {
    title: "Mua hàng sỉ",
    description: "Dành cho mua trên 50 lọ và lưu kho",
    icon: PackageSearch,
    domain: "suckhoevangpro.vn",
    type: "muasi",
    gradient: "from-violet-50 to-purple-50",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    title: "Mua hàng lẻ",
    description: "Dành cho mua dưới 50 lọ",
    icon: ShoppingBag,
    domain: "suckhoevangpro.vn",
    type: "muale",
    gradient: "from-orange-50 to-amber-50",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    title: "Quản lý đơn hàng & Doanh số",
    description: "Xem lịch sử đơn hàng và doanh số",
    icon: ClipboardList,
    domain: "protandimnrf2.vn",
    gradient: "from-cyan-50 to-sky-50",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    title: "Khuyến mãi & Tin tức",
    description: "Chương trình ưu đãi và tin tức mới",
    icon: Gift,
    gradient: "from-pink-50 to-rose-50",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
  },
];

export default function ActionCards() {
  const { openSheet, openWebview } = useUiStore();
  const user = useAuthStore((s) => s.user);
  const username = user?.username || "";

  return (
    <div className="mx-4 grid grid-cols-2 gap-2" role="group" aria-label="Tính năng nhanh">
      {actions.map((item, index) => {
        const Icon = item.icon;
        const isPromotion = item.title === "Khuyến mãi & Tin tức";
        return (
          <motion.button
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (isPromotion) {
                openSheet("promotions");
              } else if (item.domain) {
                const url = buildExternalUrl(item.domain, username, item.type);
                if (item.domain === "protandimnrf2.vn") {
                  openWebview(url);
                } else {
                  window.open(url, "_blank");
                }
              }
            }}
            aria-label={item.title}
            className={`flex items-center gap-2.5 rounded-2xl bg-gradient-to-br ${item.gradient} border border-gray-100/50 py-[26px] px-3 text-left shadow-sm transition-all active:shadow-none`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor}`}
              aria-hidden
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
              {item.description && (
                <p className="mt-0.5 text-[11px] leading-tight text-gray-500">
                  {item.description}
                </p>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
