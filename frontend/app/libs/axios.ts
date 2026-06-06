import axios from "axios";
import { useAuthStore } from "../stores/authStore";
import { refreshTokenRequest } from "../services/Auth/refreshTokenService";
import { router } from "expo-router";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { refreshToken } = useAuthStore.getState();

        if (!refreshToken) {
          throw new Error("No refresh token");
        }

        const res = await refreshTokenRequest(refreshToken);

        useAuthStore.getState().setAccessToken(res.accessToken);

        originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;

        return api(originalRequest);

      } catch {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 403 &&
      error.response?.data?.message ===
        "Your account is currently inactive. Please contact your administrator."
    ) {
      useAuthStore.getState().logout();

      router.replace("/login");
    }

    return Promise.reject(error);
  }
);