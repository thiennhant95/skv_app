"use client";

import { useUiStore } from "@/store/uiStore";
import BottomSheet from "@/components/ui/bottom-sheet";
import { Globe, Smartphone, MonitorSmartphone, Share2, Plus, AppWindow, ArrowDownToLine, CheckCircle } from "lucide-react";

export default function HelpSheet() {
  const { activeSheet, closeSheet } = useUiStore();
  const open = activeSheet === "help";

  return (
    <BottomSheet open={open} onClose={closeSheet} title="Cài đặt ứng dụng">
      <div className="pb-4 space-y-6">
        <p className="text-sm text-gray-500 leading-relaxed">
          Cài SKV CTV vào màn hình chính để mở nhanh như ứng dụng di động, kể cả khi không có mạng.
        </p>

        {/* Mở trình duyệt */}
        <Section icon={<Globe className="h-5 w-5 text-sky-600" />} title="Bước 1: Mở trình duyệt" bg="bg-sky-50">
          <p className="text-sm text-gray-700">
            Mở <strong>Safari</strong> (iPhone) hoặc <strong>Chrome</strong> (Android), truy cập:
          </p>
          <div className="mt-2 rounded-xl bg-white border border-sky-100 px-4 py-3 text-center">
            <code className="text-sm font-bold text-sky-700">app.suckhoevangpro.vn</code>
          </div>
        </Section>

        {/* Android */}
        <Section icon={<Smartphone className="h-5 w-5 text-emerald-600" />} title="Android (Chrome)" bg="bg-emerald-50">
          <div className="space-y-2">
            <Step number={1}>
              Nhấn vào biểu tượng <strong>⋮</strong> (3 chấm) góc phải trên
            </Step>
            <Step number={2}>
              Chọn <strong>Thêm vào Màn hình chính</strong>
            </Step>
            <Step number={3}>
              Nhấn <strong>Thêm</strong> ở góc dưới
            </Step>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-xs text-gray-500">
            <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
            Icon SKV CTV sẽ hiện trên màn hình chính
          </div>
        </Section>

        {/* iOS */}
        <Section icon={<MonitorSmartphone className="h-5 w-5 text-blue-600" />} title="iPhone / iPad (Safari)" bg="bg-blue-50">
          <div className="space-y-2">
            <Step number={1}>
              Nhấn biểu tượng <strong>□↑</strong> (Chia sẻ) ở thanh dưới
            </Step>
            <Step number={2}>
              Vuốt xuống, chọn <strong>Thêm vào màn hình chính</strong>
            </Step>
            <Step number={3}>
              Nhấn <strong>Thêm</strong> góc phải trên
            </Step>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2.5 text-xs text-gray-500">
            <CheckCircle className="h-4 w-4 text-blue-500 shrink-0" />
            Icon SKV CTV sẽ hiện trên màn hình chính
          </div>
          <div className="mt-2 rounded-xl bg-amber-50 px-4 py-2.5 text-xs text-amber-700">
            💡 Mở app từ màn hình chính → chọn <strong>Cho phép thông báo</strong> để nhận push notification
          </div>
        </Section>

        {/* Hoàn tất */}
        <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 shadow-sm">
              <AppWindow className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Hoàn tất</p>
              <p className="mt-0.5 text-xs text-gray-500 leading-relaxed">
                Từ lần sau, chỉ cần chạm vào icon SKV CTV trên màn hình chính để mở ứng dụng — nhanh như app thật, không cần trình duyệt.
              </p>
            </div>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}

function Section({ icon, title, bg, children }: { icon: React.ReactNode; title: string; bg: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${bg.replace('50', '100')}`}>
          {icon}
        </div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
      </div>
      <div className={`rounded-2xl ${bg} px-4 py-3.5`}>
        {children}
      </div>
    </div>
  );
}

function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-white">
        {number}
      </span>
      <p className="text-sm text-gray-700">{children}</p>
    </div>
  );
}
