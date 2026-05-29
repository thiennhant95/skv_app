import apiClient from "./apiClient";
import type { ApiResponse, ReferralF1Data } from "@/types";

export async function getReferralF1(params?: {
  username?: string;
  from_date?: string;
  page?: number;
  limit?: number;
}): Promise<ReferralF1Data> {
  const res = await apiClient.get<ApiResponse<ReferralF1Data>>("/referral-f1", {
    params: {
      page: params?.page || 1,
      limit: params?.limit || 15,
      ...(params?.username ? { username: params.username } : {}),
      ...(params?.from_date ? { from_date: params.from_date } : {}),
    },
  });
  return res.data.data;
}
