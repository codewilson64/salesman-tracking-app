import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSalesmenById } from "../../services/Salesmen/salesmenService";

export const useDeleteSalesman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSalesmenById(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["salesman", id] });
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};