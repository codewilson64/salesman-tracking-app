import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCustomer } from "../../services/customer/customerService";
import { TCustomerInput } from "../../libs/customer.schema";
import { uploadImage } from "../../services/upload/uploadService";

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      image,
    }: {
      data: TCustomerInput;
      image?: string | null;
    }) => {
      let imageData: { url: string; public_id: string } | undefined;
      
      if (image) {
        try {
          console.log("Uploading image...");
          imageData = await uploadImage(image, "customers");
        } catch (err) {
          console.error("UPLOAD ERROR:", err);
          throw new Error("Image upload failed");
        }
      }
      
      return createCustomer({
        ...data,
        ...(imageData && {
          customerImage: imageData.url,
          customerImageId: imageData.public_id,
        }),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};