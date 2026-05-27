import apiClient from "./apiClient";
import type { ApiResponse } from "@/types";

export async function subscribePushSubscription(subscription: PushSubscription): Promise<void> {
  await apiClient.post<ApiResponse<null>>("/push/subscribe", {
    endpoint: subscription.endpoint,
    auth_key: subscription.toJSON().keys?.auth || "",
    p256dh_key: subscription.toJSON().keys?.p256dh || "",
  });
}
