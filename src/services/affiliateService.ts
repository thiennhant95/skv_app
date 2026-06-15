import apiClient from "./apiClient";
import type { ApiResponse, AffiliateInfo } from "@/types";

export async function getAffiliateInfo(): Promise<AffiliateInfo> {
  const res = await apiClient.get<ApiResponse<AffiliateInfo>>("/affiliate/info");
  return res.data.data;
}
