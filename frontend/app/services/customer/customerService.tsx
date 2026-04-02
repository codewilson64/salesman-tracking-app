import { api } from "../../libs/axios";
import { customerSchema, TCustomerInput } from "../../libs/customer.schema";
import z from "zod";

type FormData = Partial<z.infer<typeof customerSchema>>;

// CREATE
export const createCustomer = async (data: TCustomerInput) => {
  const res = await api.post("/customers", data);
  return res.data.data;
};

// GET ALL
export const getAllCustomers = async () => {
  const res = await api.get("/customers");
  return res.data.data;
};

// GET BY ID
export const getCustomerById = async (id: string) => {
  const res = await api.get(`/customers/${id}`);
  return res.data.data;
};

// UPDATE
export const updateCustomerById = async ( id: string, data: FormData) => {
  const res = await api.patch(`/customers/${id}`, data);
  return res.data.data;
};

// DELETE
export const deleteCustomerById = async (id: string) => {
  const res = await api.delete(`/customers/${id}`);
  return res.data;
};