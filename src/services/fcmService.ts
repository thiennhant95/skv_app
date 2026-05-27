import { initFirebase, getFcmToken } from "@/lib/firebase";
import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";
import { registerDeviceToken } from "./deviceTokenService";

export async function initFcmOnLogin(): Promise<string | null> {
  try {
    const ready = await initFirebase();
    if (!ready) {
      await registerDeviceToken();
      return null;
    }

    const fcmToken = await getFcmToken();
    if (fcmToken) {
      await apiClient.post<ApiResponse<null>>("/device-token", {
        device_token: fcmToken,
      });
      return fcmToken;
    }

    await registerDeviceToken();
    return null;
  } catch {
    try { await registerDeviceToken(); } catch { /* silent */ }
    return null;
  }
}

export async function getFcmTokenForLogin(): Promise<string | null> {
  try {
    const ready = await initFirebase();
    if (!ready) return null;
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;
    return await getFcmToken();
  } catch {
    return null;
  }
}
