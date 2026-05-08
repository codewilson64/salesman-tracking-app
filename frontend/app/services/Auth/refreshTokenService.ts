import { api } from "../../libs/axios";

export const refreshTokenRequest = async (refreshToken: string) => {
  const res = await api.post("/auth/refresh", {
    refreshToken,
  });

  return res.data;
};