import z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSalesmanById } from "../../services/Salesmen/salesmenService";
import { salesmanSchema } from "../../libs/salesmen.schema";
import { deleteImage, uploadImage } from "../../services/upload/uploadService";

type FormData = Partial<z.infer<typeof salesmanSchema>>;

export const useUpdateSalesman = () => {
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
        imageData = await uploadImage(image);

        if (oldImageId) {
          await deleteImage(oldImageId);
        }
      }

      return updateSalesmanById(id, {
        ...data,
        ...(imageData && {
          profileImage: imageData.url,
          profileImageId: imageData.public_id,
        }),
      });
    },

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
      queryClient.invalidateQueries({ queryKey: ["salesman", variables.id] });
    },
  });
};