import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../services/product/productService";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};