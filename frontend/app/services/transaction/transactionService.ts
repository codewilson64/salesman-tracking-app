import z from "zod";
import { api } from "../../libs/axios";
import { updateTransactionPaymentSchema } from "../../libs/updateTransactionPayment.schema";

type FormData = z.infer<typeof updateTransactionPaymentSchema>;

export const getOutstandingTransactions = async ({ startDate, endDate, }: { startDate?: string; endDate?: string; }) => {
  const res = await api.get("/transactions/outstanding", {
    params: { startDate, endDate },
  })
  return res.data.data;
};

export const getTransactionById = async (id: string) => {
  const res = await api.get(`/transactions/${id}`)
  return res.data.data
}

export const updateTransactionPayment = async (id: string, data: FormData) => {
  const res = await api.patch(`/transactions/${id}`, data);
  return res.data.data;
};