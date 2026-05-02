import apiClient from "../api-client";
import { User, ApiResponse, PaginatedResponse } from "@/types";

export const userService = {
  getAll: async () => {
    const { data } = await apiClient.get<PaginatedResponse<User>>("/users");
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return data;
  },

  updateProfile: async (payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<User>>("/users/me", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<User>>(`/users/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/users/${id}`);
    return data;
  },

  toggleWishlist: async (propertyId: string) => {
    const { data } = await apiClient.post<ApiResponse<User>>(
      `/users/wishlist/${propertyId}`,
      {}
    );
    return data;
  },

  getStats: async () => {
    const { data } = await apiClient.get<ApiResponse<any>>("/users/stats");
    return data;
  },
};
