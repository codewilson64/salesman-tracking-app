import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkoutVisit } from "../../services/visit/visitService";

export const useCheckoutVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkoutVisit,

    onSuccess: () => {
      // refresh visit list
      queryClient.invalidateQueries({ queryKey: ["visits"] });

      // optional (if you have active visit query)
      queryClient.invalidateQueries({ queryKey: ["active-visit"] });
    },
  });
};