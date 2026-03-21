import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSalesmanById } from "../../services/Salesmen/salesmenService";

export const useDeleteSalesman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSalesmanById(id),

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["salesman", id] });
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};