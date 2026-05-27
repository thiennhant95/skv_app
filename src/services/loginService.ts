import apiClient from "./apiClient";
import type { ApiResponse, LoginResponse } from "@/types";

export async function loginApi(username: string, password: string, deviceToken?: string): Promise<LoginResponse> {
  const body: Record<string, string> = { username, password };
  if (deviceToken) body.device_token = deviceToken;

  const res = await apiClient.post<ApiResponse<LoginResponse>>("/login", body);
  return res.data.data;
}
