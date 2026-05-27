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
    await registerDeviceToken().catch(() => {});
    return null;
  }
}
