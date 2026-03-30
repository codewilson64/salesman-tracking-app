import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/product/productService";
import { Product } from "../../types/product";

export const useGetProductById = (id: string) => {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};