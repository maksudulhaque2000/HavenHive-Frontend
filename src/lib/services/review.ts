import apiClient from "../api-client";
import { Review, PaginatedResponse, ApiResponse } from "@/types";

export const reviewService = {
  getApproved: async () => {
    const { data } = await apiClient.get<ApiResponse<Review[]>>("/reviews/approved");
    return data;
  },

  getByProperty: async (propertyId: string) => {
    const { data } = await apiClient.get<PaginatedResponse<Review>>(
      `/reviews/property/${propertyId}`
    );
    return data;
  },

  getPending: async () => {
    const { data } = await apiClient.get<ApiResponse<Review[]>>("/reviews/pending");
    return data;
  },

  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<Review>>("/reviews", payload);
    return data;
  },

  approve: async (id: string) => {
    const { data } = await apiClient.patch<ApiResponse<Review>>(`/reviews/${id}/approve`, { status: "approved" });
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/reviews/${id}`);
    return data;
  },
};
