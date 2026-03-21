import { api } from "../../libs/axios";
import { TcreateSalesmanSchema } from "../../libs/salesmen.schema";

type FormData = {
  name: string;
  address?: string;
  phone?: string;
};

export const createSalesmen = async (data: TcreateSalesmanSchema) => {
  const res = await api.post("/salesmen", data)
  return res.data.data
}

export const getAllSalesmen = async () => {
  const res = await api.get("/salesmen");
  return res.data.data;
};

export const getSalesmenById = async (id: string) => {
  const res = await api.get(`/salesmen/${id}`)
  return res.data.data
}

export const updateSalesmenById = async (
  id: string,
  data: FormData
) => {
  const res = await api.put(`/salesmen/${id}`, data);
  return res.data.data;
};

export const deleteSalesmenById = async (id: string) => {
  const res = await api.delete(`/salesmen/${id}`)
  return res.data
}