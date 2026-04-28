import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSalesmanAccountById } from "../../services/Salesmen/salesmenService";

export const useDeleteSalesman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSalesmanAccountById,

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["salesman", id] });
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};