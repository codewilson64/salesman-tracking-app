import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSalesmanById } from "../../services/Salesmen/salesmenService";

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
    }) => updateSalesmanById(id, data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["salesmen"] });
      queryClient.invalidateQueries({ queryKey: ["salesman", variables.id] });
    },
  });
};