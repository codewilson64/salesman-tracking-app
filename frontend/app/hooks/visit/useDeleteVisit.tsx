import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImage } from "../../services/upload/uploadService";
import { deleteVisitById } from "../../services/visit/visitService";

export const useDeleteVisit = () => {
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

      return deleteVisitById(id);
    },

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["visit", id] });
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
};