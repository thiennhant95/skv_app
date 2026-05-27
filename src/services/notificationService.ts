import apiClient from "./apiClient";
import type { ApiResponse, NotificationsData } from "@/types";

const PAGE_LIMIT = 20;

export async function getNotifications(page = 1): Promise<NotificationsData> {
  const res = await apiClient.get<ApiResponse<NotificationsData>>("/notifications", {
    params: { page, limit: PAGE_LIMIT },
  });
  return res.data.data;
}

export async function markNotificationRead(id: number): Promise<void> {
  await apiClient.put(`/notification/read/${id}`);
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiClient.put("/notifications/read-all");
}
