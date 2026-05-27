import { create } from "zustand";

export type ActiveSheet = "notifications" | "promotions" | "profile" | "help" | "ranking" | null;

interface UiState {
  activeSheet: ActiveSheet;
  openSheet: (sheet: ActiveSheet) => void;
  closeSheet: () => void;
  unreadCount: number;
  setUnreadCount: (count: number) => void;
  webviewUrl: string | null;
  openWebview: (url: string) => void;
  closeWebview: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  activeSheet: null,
  unreadCount: 0,
  webviewUrl: null,
  openSheet: (sheet) => set({ activeSheet: sheet }),
  closeSheet: () => set({ activeSheet: null }),
  setUnreadCount: (count) => set({ unreadCount: count }),
  openWebview: (url) => set({ webviewUrl: url }),
  closeWebview: () => set({ webviewUrl: null }),
}));
