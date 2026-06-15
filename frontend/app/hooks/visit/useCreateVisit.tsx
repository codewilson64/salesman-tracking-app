import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVisit } from "../../services/visit/visitService";
import { TVisitInput } from "../../libs/visit.schema";
import { uploadImage } from "../../services/upload/uploadService";

export const useCreateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
          data,
          image,
        }: {
          data: TVisitInput;
          image?: string | null;
        }) => {
          let imageData: { url: string; public_id: string } | undefined;
    
          if (image) {
            try {
              console.log("Uploading image...", image);
              imageData = await uploadImage(image, "salesmen/visits");
              console.log("VISIT IMAGE DATA:", image);
            } catch (err) {
              console.error("UPLOAD ERROR:", err);
              throw new Error("Image upload failed, please try again");
            }
          }
    
          return createVisit({
            ...data,
            ...(imageData && {
              checkInImage: imageData.url,
              checkInImageId: imageData.public_id,
            }),
          });
        },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
};