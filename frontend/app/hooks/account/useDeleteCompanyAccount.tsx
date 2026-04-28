import { useMutation } from "@tanstack/react-query";
import { deleteCompanyAccount } from "../../services/account/accountService";

export const useDeleteCompanyAccount = () => {
  return useMutation({
    mutationFn: deleteCompanyAccount,
  });
};