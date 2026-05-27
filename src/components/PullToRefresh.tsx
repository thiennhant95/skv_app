"use client";

import { useRef, useState, useCallback, type ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface PullToRefreshProps {
  onRefresh: () => Promise<void> | void;
  children: ReactNode;
}

export default function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (containerRef.current && containerRef.current.scrollTop <= 0) {
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0) {
      setPullDistance(Math.min(diff * 0.45, 120));
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;

    if (pullDistance >= 70) {
      setRefreshing(true);
      setPullDistance(50);
      try {
        await onRefresh();
      } catch {
        // silent
      }
      setRefreshing(false);
    }
    setPullDistance(0);
  }, [pullDistance, onRefresh]);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-full overflow-y-auto overscroll-none touch-pan-y"
    >
      <div className="relative">
        <motion.div
          animate={{ height: pullDistance }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex items-center justify-center overflow-hidden"
        >
          {refreshing ? (
            <div className="flex items-center gap-2 text-sm text-amber-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang làm mới...
            </div>
          ) : pullDistance > 20 ? (
            <span className="text-xs text-gray-400">Kéo để làm mới</span>
          ) : null}
        </motion.div>
        {children}
      </div>
    </div>
  );
}
