import apiClient from "../api-client";
import { Booking, PaginatedResponse, ApiResponse } from "@/types";

export const bookingService = {
  getAll: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Booking>>("/bookings");
    return data;
  },

  getById: async (id: string) => {
    const { data } = await apiClient.get<ApiResponse<Booking>>(`/bookings/${id}`);
    return data;
  },

  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<Booking>>("/bookings", payload);
    return data;
  },

  update: async (id: string, payload: any) => {
    const { data } = await apiClient.patch<ApiResponse<Booking>>(`/bookings/${id}`, payload);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/bookings/${id}`);
    return data;
  },
};
