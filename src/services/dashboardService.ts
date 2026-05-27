import apiClient from "./apiClient";
import type { ApiResponse, DashboardData } from "@/types";

export async function getDashboard(): Promise<DashboardData> {
  const res = await apiClient.get<ApiResponse<DashboardData>>("/dashboard");
  return res.data.data;
}
