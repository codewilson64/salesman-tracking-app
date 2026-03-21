import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSalesmenById } from "../../services/Salesmen/salesmenService";

type FormData = {
  name: string;
  address?: string;
  phone?: string;
};

export const useUpdateSalesman = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateSalesmenById(id, data),

    onSuccess: (updatedSalesman, variables) => {
      const { id } = variables;

      // Update detail cache instantly
      queryClient.setQueryData(["salesman", id], updatedSalesman);

      // Update list cache (important!)
      queryClient.setQueryData(["salesmen"], (old: any) => {
        if (!old) return old;

        return old.map((item: any) =>
          item.id === id ? { ...item, ...updatedSalesman } : item
        );
      });

      // (optional fallback)
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
    },
  });
};