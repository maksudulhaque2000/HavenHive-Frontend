import apiClient from "../api-client";
import { Booking, PaginatedResponse, ApiResponse } from "@/types";

export const bookingService = {
  getAll: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Booking>>("/api/bookings");
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Booking>>(`/api/bookings/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<Booking>>("/api/bookings", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<Booking>>(`/api/bookings/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/api/bookings/${id}`);
    return data;
  },
};
