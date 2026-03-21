import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalesmen } from "../../services/Salesmen/salesmenService";

export const useCreateSalesman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalesmen,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};