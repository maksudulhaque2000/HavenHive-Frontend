import apiClient from "../api-client";
import { Blog, PaginatedResponse, ApiResponse } from "@/types";

export const blogService = {
  getAll: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Blog>>("/api/blogs");
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Blog>>(`/api/blogs/${slug}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<Blog>>("/api/blogs", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<Blog>>(`/api/blogs/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/api/blogs/${id}`);
    return data;
  },
};
