import apiClient from "../api-client";
import { User, LoginPayload, RegisterPayload, ApiResponse, AuthResponse } from "@/types";

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/register", payload);
    return data;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/login", payload);
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/logout");
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/auth/reset-password", {
      token,
      password,
    });
    return data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await apiClient.post<ApiResponse<User>>("/auth/verify-email", { token });
    return data;
  },

  requestEmailVerification: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>("/auth/verify-email/request");
    return data;
  },
};
