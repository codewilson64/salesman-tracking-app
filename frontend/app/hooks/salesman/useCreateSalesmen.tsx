import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalesman } from "../../services/Salesmen/salesmenService";
import { TSalesmanInput } from "../../libs/salesmen.schema";
import { uploadImage } from "../../services/upload/uploadService";

export const useCreateSalesman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      image,
    }: {
      data: TSalesmanInput;
      image?: string | null;
    }) => {
      let imageData: { url: string; public_id: string } | undefined;

      if (image) {
        try {
          console.log("Uploading image...");
          imageData = await uploadImage(image, "salesmen/profile");
        } catch (err) {
          console.error("UPLOAD ERROR:", err);
          throw new Error("Image upload failed");
        }
      }

      return createSalesman({
        ...data,
        ...(imageData && {
          profileImage: imageData.url,
          profileImageId: imageData.public_id,
        }),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};