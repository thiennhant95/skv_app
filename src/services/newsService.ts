import apiClient from "./apiClient";
import type { ApiResponse, PaginatedItems } from "@/types";

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  short_content: string;
  content: string;
  excerpt: string;
  image: string;
  category: string;
  category_label: string;
  created_at: number;
  updated_at: number;
}

export async function getNews(page = 1): Promise<PaginatedItems<NewsItem>> {
  const res = await apiClient.get<ApiResponse<PaginatedItems<NewsItem>>>("/news", {
    params: { page, limit: 20 },
  });
  return res.data.data;
}

export async function getNewsDetail(idOrSlug: string | number): Promise<NewsItem> {
  const res = await apiClient.get<ApiResponse<NewsItem>>(`/news/${idOrSlug}`);
  return res.data.data;
}
