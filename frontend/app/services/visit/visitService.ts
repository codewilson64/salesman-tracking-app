import { TVisitInput } from "../../libs/visit.schema";
import { api } from "../../libs/axios";
import { TCheckoutVisit } from "../../libs/checkout.schema";
import { TReviewVisitInput } from "../../libs/reviewVisit.schema";

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
  const { id, ...payload } = data;

  const res = await api.patch(`/visits/${id}/checkout`, payload);
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

// review visit API
export const reviewVisitById = async (id: string, data: TReviewVisitInput) => {  
  const res = await api.patch(`/visits/${id}/review`, data);
  return res.data;
};


