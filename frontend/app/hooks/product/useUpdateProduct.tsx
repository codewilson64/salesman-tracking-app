import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProductById } from "../../services/product/productService";
import { productSchema } from "../../libs/product.schema";
import z from "zod";
import { deleteImage, uploadImage } from "../../services/upload/uploadService";

type FormData = z.infer<typeof productSchema>;

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
          id,
          data,
          image,
          oldImageId,
        }: {
          id: string;
          data: FormData;
          image?: string | null;
          oldImageId?: string;
        }) => {
          let imageData;
    
          if (image) {
            imageData = await uploadImage(image, "products");
    
            if (oldImageId) {
              await deleteImage(oldImageId);
            }
          }
    
          return updateProductById(id, {
            ...data,
            ...(imageData && {
              productImage: imageData.url,
              productImageId: imageData.public_id,
            }),
          });
        },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
};