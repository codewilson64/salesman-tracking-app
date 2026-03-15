import { api } from "../../libs/axios";
import { TloginSchema } from "../../libs/types";

export const loginUser = async (data: TloginSchema) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};