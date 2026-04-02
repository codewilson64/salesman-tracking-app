import { useQuery } from "@tanstack/react-query";
import { getVisitById } from "../../services/visit/visitService";
import { Visit } from "../../types/visit";

export const useGetVisitById = (id: string) => {
  return useQuery<Visit>({
    queryKey: ["visit", id],
    queryFn: () => getVisitById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};