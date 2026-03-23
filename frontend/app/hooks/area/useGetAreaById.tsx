import { useQuery } from "@tanstack/react-query";
import { getAreaById } from "../../services/area/areaService";

export const useGetAreaById = (id: string) => {
  return useQuery({
    queryKey: ["area", id],
    queryFn: () => getAreaById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};