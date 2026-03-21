import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/product/productService";

export const useGetAllProduct = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });
};