import apiClient from "../api-client";
import { User, LoginPayload, RegisterPayload, ApiResponse, AuthResponse } from "@/types";

export const authService = {
  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/api/auth/register", payload);
    return data;
  },

  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/api/auth/login", payload);
    return data;
  },

  getMe: async () => {
    const { data } = await apiClient.get<ApiResponse<User>>("/api/auth/me");
    return data;
  },

  logout: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>("/api/auth/logout");
    return data;
  },

  forgotPassword: async (email: string) => {
    const { data } = await apiClient.post<ApiResponse<null>>("/api/auth/forgot-password", { email });
    return data;
  },

  resetPassword: async (token: string, password: string) => {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>("/api/auth/reset-password", {
      token,
      password,
    });
    return data;
  },

  verifyEmail: async (token: string) => {
    const { data } = await apiClient.post<ApiResponse<User>>("/api/auth/verify-email", { token });
    return data;
  },

  requestEmailVerification: async () => {
    const { data } = await apiClient.post<ApiResponse<null>>("/api/auth/verify-email/request");
    return data;
  },
};
