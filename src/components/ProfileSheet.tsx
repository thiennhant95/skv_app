"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { User, Loader2, LogOut, Mail, Phone, Shield, CheckCircle, UserPlus, MapPin, Calendar, Award, Copy, Check } from "lucide-react";
import BottomSheet from "@/components/ui/bottom-sheet";
import { useUiStore } from "@/store/uiStore";
import { useAuthStore } from "@/store/authStore";
import { getProfile } from "@/services/profileService";
import type { User as UserType } from "@/types";

export default function ProfileSheet() {
  const router = useRouter();
  const { activeSheet, closeSheet } = useUiStore();
  const logout = useAuthStore((s) => s.logout);
  const open = activeSheet === "profile";
  const [profile, setProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getProfile();
      setProfile(data);
    } catch {
      setError("Không thể tải thông tin");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchProfile();
  }, [open, fetchProfile]);

  const handleLogout = () => {
    logout();
    closeSheet();
    router.replace("/login");
  };

  const initials = profile?.fullname
    ? profile.fullname.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const avatarUrl = profile?.avatar && !profile.avatar.includes("no-avatar")
    ? profile.avatar
    : null;

  const MIN_DATE_TS = 1701388800; // 2023-12-01 00:00:00 UTC

  const formatDate = (ts: number) => {
    const effectiveTs = ts < MIN_DATE_TS ? MIN_DATE_TS : ts;
    const d = new Date(effectiveTs * 1000);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  const referralLink = profile ? `https://protandimnrf2.vn/authorize/register?ref=${profile.username}` : "";

  const copyToClipboard = async () => {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <BottomSheet open={open} onClose={closeSheet}>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-gray-400">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <User className="h-10 w-10 text-gray-300" />
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : profile ? (
        <div className="pb-4">
          <div className="flex flex-col items-center py-6">
            {avatarUrl ? (
              <img src={avatarUrl} alt={profile.fullname} loading="lazy" className="h-20 w-20 rounded-full object-cover border-2 border-amber-200 shadow-sm" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 text-2xl font-bold text-white shadow-sm">
                {initials}
              </div>
            )}
            <h2 className="mt-3 text-lg font-bold text-gray-900">{profile.fullname}</h2>
            <p className="text-sm text-gray-500">@{profile.username}</p>
            {profile.title && (
              <span className="mt-1.5 inline-block rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-0.5 text-xs font-semibold text-white shadow-sm">
                {profile.title}
              </span>
            )}
            {profile.discount_percent > 0 && (
              <span className="mt-1 inline-block text-xs font-medium text-amber-600">
                Chiết khấu: {profile.discount_percent}%
              </span>
            )}
          </div>

          <div className="space-y-3">
            {profile.email && (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900">{profile.email}</p>
                </div>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Số điện thoại</p>
                  <p className="text-sm font-medium text-gray-900">{profile.phone}</p>
                </div>
              </div>
            )}
            {profile.inviter_username && (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <UserPlus className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Người giới thiệu</p>
                  <p className="text-sm font-medium text-gray-900">{profile.inviter_username}</p>
                </div>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Địa chỉ</p>
                  <p className="text-sm font-medium text-gray-900">{profile.address}</p>
                </div>
              </div>
            )}
            {profile.role > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Vai trò</p>
                  <p className="text-sm font-medium text-gray-900">Cộng tác viên</p>
                </div>
              </div>
            )}
            {profile.created_at > 0 && (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Ngày tham gia</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(profile.created_at)}</p>
                </div>
              </div>
            )}
            {profile.status === 1 && (
              <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
                <CheckCircle className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-[11px] text-gray-400">Trạng thái</p>
                  <p className="text-sm font-medium text-emerald-600">Đã xác thực</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-4 py-3">
              <UserPlus className="h-5 w-5 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-gray-400">Link giới thiệu</p>
                <p className="text-sm font-medium text-gray-900 truncate">{referralLink}</p>
              </div>
              <button
                onClick={copyToClipboard}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-3.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-5 w-5" />
            Đăng xuất
          </button>
        </div>
      ) : null}
    </BottomSheet>
  );
}
