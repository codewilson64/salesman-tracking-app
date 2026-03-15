import { api } from "../../libs/axios";
import { TsignUpSchema } from "../../libs/types";

export const signupUser = async (data: TsignUpSchema) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};