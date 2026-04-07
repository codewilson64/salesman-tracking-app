import { TVisitInput } from "../../libs/visit.schema";
import { api } from "../../libs/axios";
import { TCheckoutVisit } from "../../libs/checkout.schema";

export const createVisit = async (data: TVisitInput) => {
  const res = await api.post("/visits", data);
  return res.data.data;
};

export const getAllVisits = async ({ startDate, endDate, }: { startDate?: string; endDate?: string; }) => {
  const res = await api.get("/visits", {
    params: { startDate, endDate },
  })
  return res.data.data;
};

export const checkoutVisit = async (data: TCheckoutVisit) => {
  const res = await api.patch("/visits/checkout", data);
  return res.data.data;
};

export const getVisitById = async (id: string) => {
  const res = await api.get(`/visits/${id}`)
  return res.data.data
}

export const deleteVisitById = async (id: string) => {
  const res = await api.delete(`/visits/${id}`)
  return res.data
}



