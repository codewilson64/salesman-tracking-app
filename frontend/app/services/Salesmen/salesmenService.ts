import { api } from "../../libs/axios";
import { salesmanSchema, TSalesmanInput } from "../../libs/salesmen.schema";
import z from "zod";

type FormData = Partial<z.infer<typeof salesmanSchema>>;

export const createSalesman = async (data: TSalesmanInput) => {
  const res = await api.post("/salesmen", data)
  return res.data.data
}

export const getAllSalesmen = async () => {
  const res = await api.get("/salesmen");
  return res.data.data;
};

export const getSalesmanById = async (id: string) => {
  const res = await api.get(`/salesmen/${id}`)
  return res.data.data
}

export const updateSalesmanById = async (id: string, data: FormData) => {
  const res = await api.put(`/salesmen/${id}`, data);
  return res.data.data;
};

export const deleteSalesmanById = async (id: string) => {
  const res = await api.delete(`/salesmen/${id}`)
  return res.data
}