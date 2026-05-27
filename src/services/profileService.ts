import apiClient from "./apiClient";
import type { ApiResponse, User } from "@/types";

export async function getProfile(): Promise<User> {
  const res = await apiClient.get<ApiResponse<User>>("/profile");
  return res.data.data;
}
