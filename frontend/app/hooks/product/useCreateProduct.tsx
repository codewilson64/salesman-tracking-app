import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct } from "../../services/product/productService";
import { TProductInput } from "../../libs/product.schema";
import { uploadImage } from "../../services/upload/uploadService";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: async ({
        data,
        image,
      }: {
        data: TProductInput;
        image?: string | null;
      }) => {
        let imageData: { url: string; public_id: string } | undefined;
  
        if (image) {
        try {
          console.log("Uploading image...");
          imageData = await uploadImage(image, "products");
        } catch (err) {
          console.error("UPLOAD ERROR:", err);
          throw new Error("Image upload failed");
        }
      }
  
        return createProduct({
          ...data,
          ...(imageData && {
            productImage: imageData.url,
            productImageId: imageData.public_id,
          }),
        });
      },
  
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products"] });
      },
    });
};