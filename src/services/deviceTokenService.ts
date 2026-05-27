import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";

const DEVICE_ID_KEY = "skv_device_id";

function getOrCreateDeviceId(): string {
  let id = localStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = `web_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    localStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

export async function registerDeviceToken(): Promise<void> {
  try {
    const deviceToken = getOrCreateDeviceId();
    await apiClient.post<ApiResponse<null>>("/device-token", {
      device_token: deviceToken,
    });
  } catch {
    // Silent fail — device token registration is non-critical
  }
}
