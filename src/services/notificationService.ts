import apiClient from "./apiClient";
import type { ApiResponse, NotificationsData } from "@/types";

export async function getNotifications(): Promise<NotificationsData> {
  const res = await apiClient.get<ApiResponse<NotificationsData>>("/notifications");
  return res.data.data;
}

export async function markNotificationRead(id: number): Promise<void> {
  await apiClient.put(`/notification/read/${id}`);
}
