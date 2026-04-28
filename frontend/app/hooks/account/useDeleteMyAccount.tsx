import { useMutation } from "@tanstack/react-query";
import { deleteMyAccount } from "../../services/account/accountService";

export const useDeleteMyAccount = () => {
  return useMutation({
    mutationFn: deleteMyAccount,
  });
};