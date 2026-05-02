import apiClient from "../api-client";
import { Blog, PaginatedResponse, ApiResponse } from "@/types";

export const blogService = {
  getAll: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Blog>>("/blogs");
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Blog>>(`/blogs/${slug}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<Blog>>("/blogs", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<Blog>>(`/blogs/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/blogs/${id}`);
    return data;
  },
};
