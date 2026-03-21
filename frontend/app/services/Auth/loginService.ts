import { TloginSchema } from "../../libs/auth.schema";
import { api } from "../../libs/axios";

export const loginUser = async (data: TloginSchema) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};