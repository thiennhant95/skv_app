import apiClient from "./apiClient";
import type { ApiResponse, CompetitionData } from "@/types";

export async function getCompetitionTop(limit = 15, offset = 0): Promise<CompetitionData> {
  const res = await apiClient.get<ApiResponse<CompetitionData>>("/competition-top", {
    params: { limit, offset },
  });
  return res.data.data;
}
