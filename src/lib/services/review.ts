import apiClient from "../api-client";
import { Review, PaginatedResponse, ApiResponse } from "@/types";

export const reviewService = {
  getByProperty: async (propertyId: string) => {
    const { data } = await apiClient.get<PaginatedResponse<Review>>(
      `/api/reviews/property/${propertyId}`
    );
    return data;
  },

  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<Review>>("/api/reviews", payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/api/reviews/${id}`);
    return data;
  },
};
