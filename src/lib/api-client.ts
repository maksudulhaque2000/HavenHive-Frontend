import axios from "axios";

import { toastEvents } from "@/components/ui/toast-events";

const AUTH_TOKEN_KEY = "havenhive_token";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? window.localStorage.getItem(AUTH_TOKEN_KEY) : null;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(AUTH_TOKEN_KEY);
        window.localStorage.removeItem("havenhive_user");
        window.dispatchEvent(new CustomEvent("havenhive:auth-expired"));
        toastEvents.emit({ type: "error", message: "Session expired. Please log in again." });
        window.location.href = "/auth/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
export { AUTH_TOKEN_KEY };
