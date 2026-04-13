import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewVisitById } from "../../services/visit/visitService";
import { TReviewVisitInput } from "../../libs/reviewVisit.schema";

export const useReviewVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      id,
      data
    }: { 
      id: string
      data: TReviewVisitInput
    }) => 
    reviewVisitById(id, data),

    onSuccess: (_, id) => {
      // refetch this visit
      queryClient.invalidateQueries({ queryKey: ["visit", id] });

      // optional: refresh list page
      queryClient.invalidateQueries({ queryKey: ["visits"] });
    },
  });
};