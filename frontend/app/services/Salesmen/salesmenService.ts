import { api } from "../../libs/axios";
import { TcreateSalesmanSchema } from "../../libs/salesmen.schema";
import { UpdateSalesmanInput } from "../../stores/salesmenStore";

export const createSalesmen = async (data: TcreateSalesmanSchema) => {
  const res = await api.post("/salesmen", data)
  return res.data
}

export const getAllSalesmen = async () => {
  const res = await api.get("/salesmen");
  return res.data;
};

export const getSalesmenById = async (id: string) => {
  const res = await api.get(`/salesmen/${id}`)
  return res.data
}

export const updateSalesmenById = async (
  id: string,
  data: UpdateSalesmanInput
) => {
  const res = await api.put(`/salesmen/${id}`, data);
  return res.data;
};

export const deleteSalesmenById = async (id: string) => {
  const res = await api.delete(`/salesmen/${id}`)
  return res.data
}