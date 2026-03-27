import { useQuery } from "@tanstack/react-query";
import { getVisitById } from "../../services/visit/visitService";

export const useGetVisitById = (id: string) => {
  return useQuery({
    queryKey: ["visit", id],
    queryFn: () => getVisitById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};