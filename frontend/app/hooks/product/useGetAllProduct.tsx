import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../../services/product/productService";
import { useAuthStore } from "../../stores/authStore";

export const useGetAllProduct = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["products", user?.id],
    queryFn: getAllProducts,
    staleTime: 1000 * 60 * 5,
  });
};