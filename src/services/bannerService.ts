import apiClient from "./apiClient";
import type { ApiResponse, Banner } from "@/types";

export async function getBanners(): Promise<Banner[]> {
  const res = await apiClient.get<ApiResponse<Banner[]>>("/banners");
  return res.data.data;
}
