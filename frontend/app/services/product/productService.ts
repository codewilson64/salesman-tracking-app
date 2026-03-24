import { api } from "../../libs/axios";
import { productSchema, TProductInput } from "../../libs/product.schema";
import z from "zod";

type FormData = Partial<z.infer<typeof productSchema>>;

// CREATE
export const createProduct = async (data: TProductInput) => {
  const res = await api.post("/products", data);
  return res.data.data;
};

// GET ALL
export const getAllProducts = async () => {
  const res = await api.get("/products");
  return res.data.data;
};

// GET BY ID
export const getProductById = async (id: string) => {
  const res = await api.get(`/products/${id}`);
  return res.data.data;
};

// UPDATE
export const updateProductById = async (id: string, data: FormData) => {
  const res = await api.put(`/products/${id}`, data);
  return res.data.data;
};

// DELETE
export const deleteProductById = async (id: string) => {
  const res = await api.delete(`/products/${id}`);
  return res.data;
};