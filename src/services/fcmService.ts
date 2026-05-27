import { initFirebase, getFcmToken } from "@/lib/firebase";
import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";
import { registerDeviceToken } from "./deviceTokenService";

let initialized = false;

export async function initFcmOnLogin(): Promise<void> {
  if (initialized) return;
  initialized = true;

  try {
    const ready = await initFirebase();
    if (!ready) {
      await registerDeviceToken();
      return;
    }

    const fcmToken = await getFcmToken();
    if (fcmToken) {
      await apiClient.post<ApiResponse<null>>("/device-token", {
        device_token: fcmToken,
      });
    } else {
      await registerDeviceToken();
    }
  } catch {
    try { await registerDeviceToken(); } catch { /* silent */ }
  }
}
