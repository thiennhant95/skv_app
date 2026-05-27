import apiClient from "./apiClient";
import type { ApiResponse, PaginatedItems, Promotion } from "@/types";

export async function getPromotions(page = 1): Promise<PaginatedItems<Promotion>> {
  const res = await apiClient.get<ApiResponse<PaginatedItems<Promotion>>>("/promotions", {
    params: { page, limit: 20 },
  });
  return res.data.data;
}

export async function getPromotionDetail(idOrSlug: string | number): Promise<Promotion> {
  const res = await apiClient.get<ApiResponse<Promotion>>(`/promotions/${idOrSlug}`);
  return res.data.data;
}
