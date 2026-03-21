import { useQuery } from "@tanstack/react-query";
import { getProductById } from "../../services/product/productService";

export const useGetProductById = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};