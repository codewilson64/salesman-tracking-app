import z from "zod";
import { areaSchema, TAreaInput } from "../../libs/area.schema";
import { api } from "../../libs/axios";

type FormData = Partial<z.infer<typeof areaSchema>>;

export const createArea = async (data: TAreaInput) => {
  const res = await api.post("/areas", data)
  return res.data.data
}

export const getAllAreas = async () => {
  const res = await api.get("/areas");
  return res.data.data;
};

export const getAreaById = async (id: string) => {
  const res = await api.get(`/areas/${id}`)
  return res.data.data
}

export const updateAreaById = async (id: string, data: FormData) => {
  const res = await api.patch(`/areas/${id}`, data);
  return res.data.data;
};

export const deleteAreaById = async (id: string) => {
  const res = await api.delete(`/areas/${id}`)
  return res.data
}

export const getCustomersByArea = async (id: string) => {
  const res = await api.get(`/areas/${id}/customers`);
  return res.data.data
}