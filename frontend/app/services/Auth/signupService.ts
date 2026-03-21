import { TsignUpSchema } from "../../libs/auth.schema";
import { api } from "../../libs/axios";

export const signupUser = async (data: TsignUpSchema) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};