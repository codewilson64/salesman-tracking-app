import { api } from "../../libs/axios";

export const deleteMyAccount = async () => {
  const res = await api.delete("/delete-account/account");
  return res.data;
};

export const deleteCompanyAccount = async () => {
  const res = await api.delete("/delete-account/company");
  return res.data;
};