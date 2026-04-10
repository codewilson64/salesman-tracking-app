import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutVisit } from "../../services/visit/visitService";

export const useCheckoutVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutVisit,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
      queryClient.invalidateQueries({ queryKey: ["active-visit"] });
    },
  });
};