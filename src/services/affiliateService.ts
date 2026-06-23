import apiClient from "./apiClient";
import type { ApiResponse, AffiliateInfo, CommissionHistory } from "@/types";

export async function getAffiliateInfo(): Promise<AffiliateInfo> {
  const res = await apiClient.get<ApiResponse<AffiliateInfo>>("/affiliate/info");
  return res.data.data;
}

export async function getCommissionHistory(limit = 20, offset = 0): Promise<CommissionHistory> {
  const res = await apiClient.get<ApiResponse<CommissionHistory>>("/affiliate/commission-history", {
    params: { limit, offset },
  });
  return res.data.data;
}
