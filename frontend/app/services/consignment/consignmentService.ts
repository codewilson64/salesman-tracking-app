import { api } from "../../libs/axios";

export type TCurrentConsignmentStockInput = {
  customerId: string;
  productId: string;
};

export const getCurrentConsignmentStock = async (data: TCurrentConsignmentStockInput) => {
  const res = await api.post("/consignments/current-stock", data);
  return res.data.data;
};

export const getCustomerConsignmentStocks = async (customerId: string) => {
  const res = await api.get(`/consignments/customers/consignment-stocks/${customerId}`);
  return res.data.data;
};