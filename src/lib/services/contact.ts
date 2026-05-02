import apiClient from "../api-client";
import { Contact, PaginatedResponse, ApiResponse } from "@/types";

export const contactService = {
  create: async (payload: any) => {
    const { data } = await apiClient.post<ApiResponse<Contact>>("/api/contact", payload);
    return data;
  },

  getAll: async () => {
    const { data } = await apiClient.get<PaginatedResponse<Contact>>("/api/contact");
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch<ApiResponse<Contact>>(
      `/api/contact/${id}/status`,
      { status }
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete<ApiResponse<null>>(`/api/contact/${id}`);
    return data;
  },
};
