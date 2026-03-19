import { api } from "../../libs/axios";
import { TloginSchema } from "../../../../shared/schemas/types";

export const loginUser = async (data: TloginSchema) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};