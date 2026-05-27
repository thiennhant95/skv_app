"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useUiStore } from "@/store/uiStore";
import { getNotifications } from "@/services/notificationService";
import ErrorBoundary from "@/components/ErrorBoundary";
import NetworkStatus from "@/components/NetworkStatus";
import { HomeSkeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import UserSummaryCard from "@/components/UserSummaryCard";
import SummarySection from "@/components/SummarySection";
import ActionCards from "@/components/ActionCards";
import BottomNav from "@/components/BottomNav";
import NotificationSheet from "@/components/NotificationSheet";
import PromotionSheet from "@/components/PromotionSheet";
import ProfileSheet from "@/components/ProfileSheet";
import HelpSheet from "@/components/HelpSheet";
import RankingSheet from "@/components/RankingSheet";
import WebViewSheet from "@/components/WebViewSheet";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, hydrate } = useAuthStore();
  const { setUnreadCount } = useUiStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      getNotifications()
        .then((data) => setUnreadCount(data.unread_count))
        .catch(() => {});
    }
  }, [isAuthenticated, setUnreadCount]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gray-50/50">
        <div className="w-full max-w-md px-0">
          <HomeSkeleton />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <ErrorBoundary>
      <div className="flex h-dvh flex-col bg-gray-50/50">
        <NetworkStatus />
        <Header />
        <main className="flex-1 overflow-y-auto scrollbar-hide px-0 pb-4" role="main">
          <ErrorBoundary>
            <FlashSaleBanner />
          </ErrorBoundary>
          <div className="mt-1.5">
            <UserSummaryCard user={user} />
          </div>
          <div className="mt-1.5">
            <ErrorBoundary>
              <SummarySection />
            </ErrorBoundary>
          </div>
          <div className="mt-1.5">
            <ErrorBoundary>
              <ActionCards />
            </ErrorBoundary>
          </div>
        </main>
        <BottomNav />
        <NotificationSheet />
        <PromotionSheet />
        <ProfileSheet />
        <HelpSheet />
        <RankingSheet />
        <WebViewSheet />
      </div>
    </ErrorBoundary>
  );
}
