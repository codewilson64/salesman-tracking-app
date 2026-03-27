import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVisit } from "../../services/visit/visitService";

export const useCreateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createVisit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
};