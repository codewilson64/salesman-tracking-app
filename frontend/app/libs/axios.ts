import axios from "axios";
import { useAuthStore } from "../stores/authStore";

const BASE_URL =
  __DEV__
    ? "http://192.168.1.13:5000/api"
    : "https://sales-team-tracker-api.onrender.com/api";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});