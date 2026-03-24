import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCustomersById } from "../../services/customer/customerService";

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomersById,

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["customer", id] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};