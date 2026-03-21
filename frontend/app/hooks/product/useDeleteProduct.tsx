import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductById } from "../../services/product/productService";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductById,

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};