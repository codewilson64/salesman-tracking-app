import { api } from "../../libs/axios";

export const getOutstandingTransactions = async ({ startDate, endDate, }: { startDate?: string; endDate?: string; }) => {
  const res = await api.get("/transactions/outstanding", {
    params: { startDate, endDate },
  })
  return res.data.data;
};