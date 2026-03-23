import { useMutation, useQueryClient } from "@tanstack/react-query";
import { areaSchema } from "../../libs/area.schema";
import z from "zod";
import { updateAreaById } from "../../services/area/areaService";

type FormData = Partial<z.infer<typeof areaSchema>>;

export const useUpdateArea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: FormData;
    }) => updateAreaById(id, data),

    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["areas"] });
      queryClient.invalidateQueries({ queryKey: ["area", variables.id] });
    },
  });
};