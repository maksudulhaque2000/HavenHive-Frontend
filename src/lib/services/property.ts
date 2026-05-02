import apiClient from "../api-client";
import { Property, PaginatedResponse, ApiResponse, StatsResponse } from "@/types";

export const propertyService = {
  getAll: async (params?: Record<string, any>) => {
    const { data } = await apiClient.get<PaginatedResponse<Property>>("/api/properties", { params });
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Property>>(`/api/properties/${id}`);
    return data;
  },

  create: async (payload: FormData) => {
    const { data } = await apiClient.post<ApiResponse<Property>>("/api/properties", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  update: async (id: string, payload: FormData) => {
    const { data } = await apiClient.patch<ApiResponse<Property>>(`/api/properties/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/api/properties/${id}`);
    return data;
  },

  getFeatured: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Property>>("/api/properties/featured");
    return data;
  },

  getStats: async () => {
    const { data } = await apiClient.get<ApiResponse<StatsResponse>>("/api/properties/stats");
    return data;
  },
};
