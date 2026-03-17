import { api } from "../../libs/axios";

export const getAllSalesmen = async () => {
  const res = await api.get("/salesmen");
  return res.data;
};

export const getSalesmenById = async (id: string) => {
  const res = await api.get(`/salesmen/${id}`)
  return res.data
}