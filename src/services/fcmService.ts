import { initFirebase, getFcmToken } from "@/lib/firebase";
import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";

export async function initFcmOnLogin(): Promise<string | null> {
  try {
    const ready = await initFirebase();
    if (!ready) return null;

    const fcmToken = await getFcmToken();
    if (!fcmToken) return null;

    await apiClient.post<ApiResponse<null>>("/device-token", {
      device_token: fcmToken,
    });
    return fcmToken;
  } catch {
    return null;
  }
}
