import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProductById } from "../../services/product/productService";
import { deleteImage } from "../../services/upload/uploadService";

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

   return useMutation({
      mutationFn: async ({
        id,
        imageId,
      }: {
        id: string;
        imageId?: string;
      }) => {
  
        if (imageId) {
          await deleteImage(imageId);
        }
  
        return deleteProductById(id);
      },

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["product", id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};