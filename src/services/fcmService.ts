import { initFirebase, getFcmToken } from "@/lib/firebase";
import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";
import { registerDeviceToken } from "./deviceTokenService";

let lastToken: string | null = null;

export async function getLastSentToken(): Promise<string | null> {
  return lastToken;
}

export async function initFcmOnLogin(): Promise<string | null> {
  try {
    lastToken = null;

    // Bước 1: init Firebase
    const ready = await initFirebase();
    if (!ready) {
      await registerDeviceToken();
      return null;
    }

    // Bước 2: xin quyền thông báo
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      await Notification.requestPermission();
    }

    // Bước 3: lấy FCM token
    const fcmToken = await getFcmToken();
    if (fcmToken) {
      // Bước 4: gửi token lên server
      await apiClient.post<ApiResponse<null>>("/device-token", {
        device_token: fcmToken,
      });
      lastToken = fcmToken;
      return fcmToken;
    }

    // Bước 5: fallback nếu Firebase không lấy được token
    await registerDeviceToken();
    return null;
  } catch (err) {
    try { await registerDeviceToken(); } catch { /* silent */ }
    return null;
  }
}
