import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSalesman } from "../../services/Salesmen/salesmenService";

export const useCreateSalesman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSalesman,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};