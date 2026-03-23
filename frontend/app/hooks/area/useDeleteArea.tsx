import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAreaById } from "../../services/area/areaService";

export const useDeleteArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAreaById,

    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["area", id] });
      queryClient.invalidateQueries({ queryKey: ["areas"] });
    },
  });
};