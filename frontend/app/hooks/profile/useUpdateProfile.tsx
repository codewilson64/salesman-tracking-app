import { useMutation, useQueryClient } from "@tanstack/react-query";
import z from "zod";
import { updateProfile } from "../../services/profile/profileService";
import { deleteImage, uploadImage } from "../../services/upload/uploadService";
import { updateProfileSchema } from "../../libs/profile.schema";

type FormData = Partial<z.infer<typeof updateProfileSchema>>;

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      image,
      oldImageId,
    }: {
      data: FormData;
      image?: string | null;
      oldImageId?: string;
    }) => {
      let imageData;

      if (image) {
        imageData = await uploadImage(image, "salesmen/profile");

        if (oldImageId) {
          await deleteImage(oldImageId);
        }
      }

      return updateProfile({
        ...data,
        ...(imageData && {
          profileImage: imageData.url,
          profileImageId: imageData.public_id,
        }),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};