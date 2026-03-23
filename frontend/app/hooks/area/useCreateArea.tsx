import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createArea } from "../../services/area/areaService";

export const useCreateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createArea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};