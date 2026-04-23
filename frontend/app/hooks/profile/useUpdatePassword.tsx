import { useMutation } from "@tanstack/react-query";
import { updatePassword } from "../../services/profile/profileService";

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: {
      currentPassword: string;
      newPassword: string;
    }) => updatePassword(data),
  });
};