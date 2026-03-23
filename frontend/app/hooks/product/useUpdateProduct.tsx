import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductById } from "../../services/product/productService";
import { productSchema } from "../../libs/product.schema";
import z from "zod";

type FormData = z.infer<typeof productSchema>;

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateProductById(id, data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
};