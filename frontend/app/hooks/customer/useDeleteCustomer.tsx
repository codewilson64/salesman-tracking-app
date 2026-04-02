import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomerById } from "../../services/customer/customerService";
import { deleteImage } from "../../services/upload/uploadService";

export const useDeleteCustomer = () => {
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
  
        return deleteCustomerById(id);
      },

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["customer", id] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};