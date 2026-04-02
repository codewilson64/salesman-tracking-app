import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSalesmanById } from "../../services/Salesmen/salesmenService";
import { deleteImage } from "../../services/upload/uploadService";

export const useDeleteSalesman = () => {
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

      return deleteSalesmanById(id);
    },

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["salesman", id] });
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};