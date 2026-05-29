"use client";

import { useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingZaloButton() {
  const [visible, setVisible] = useState(true);

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            className="fixed bottom-20 right-4 z-50"
          >
            <button
              onClick={() => setVisible(false)}
              className="absolute -top-1 -right-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-white shadow-sm hover:bg-gray-500"
              aria-label="Đóng"
            >
              <X className="h-3 w-3" />
            </button>
            <a
              href="https://zalo.me/0359359468"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3 shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
            >
              <MessageCircle className="h-5 w-5 text-white" />
              <span className="text-sm font-bold text-white tracking-wide">ZALO</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!visible && (
          <motion.button
            key="collapsed"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={() => setVisible(true)}
            className="fixed bottom-20 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 shadow-lg shadow-blue-500/30 transition-transform hover:scale-105 active:scale-95"
            aria-label="Liên hệ Zalo"
          >
            <MessageCircle className="h-5 w-5 text-white" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
