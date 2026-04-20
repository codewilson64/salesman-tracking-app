import z from "zod";
import { api } from "../../libs/axios";
import { updateProfileSchema } from "../../libs/profile.schema";

type FormData = Partial<z.infer<typeof updateProfileSchema>>;

export const updateProfile = async (data: FormData) => {
  const res = await api.put("/profile/update", data);
  return res.data.data;
};

export const updatePassword = async (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  const res = await api.put("/profile/password", data);
  return res.data;
};

