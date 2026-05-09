import apiClient from "../api-client";
import { Blog, PaginatedResponse, ApiResponse } from "@/types";

export const blogService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<PaginatedResponse<Blog>>("/blogs", { params });
    return data;
  },

  getBySlug: async (slug: string) => {
    const { data } = await apiClient.get<ApiResponse<Blog>>(`/blogs/${slug}`);
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Blog>>(`/blogs/${id}`);
    return data;
  },

  create: async (payload: FormData) => {
    const { data } = await apiClient.post<ApiResponse<Blog>>("/blogs", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: string, payload: FormData) => {
    const { data } = await apiClient.patch<ApiResponse<Blog>>(`/blogs/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/blogs/${id}`);
    return data;
  },
};
