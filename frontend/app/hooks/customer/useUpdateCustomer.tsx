import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customerSchema } from "../../libs/customer.schema";
import { updateCustomerById } from "../../services/customer/customerService";
import z from "zod";
import { deleteImage, uploadImage } from "../../services/upload/uploadService";

type FormData = Partial<z.infer<typeof customerSchema>>;

export const useUpdateCustomer = () => {
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
            imageData = await uploadImage(image, "customers");
    
            if (oldImageId) {
              await deleteImage(oldImageId);
            }
          }
    
          return updateCustomerById(id, {
            ...data,
            ...(imageData && {
              customerImage: imageData.url,
              customerImageId: imageData.public_id,
            }),
          });
        },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customer", variables.id] });
    },
  });
};