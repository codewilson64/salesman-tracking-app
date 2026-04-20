import { api } from "../../libs/axios";

export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data.user;
};