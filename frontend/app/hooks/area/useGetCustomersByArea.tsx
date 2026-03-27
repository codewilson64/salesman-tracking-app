import { useQuery } from "@tanstack/react-query";
import { getCustomersByArea } from "../../services/area/areaService";

export const useGetCustomersByArea = (id: string) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomersByArea(id),
    staleTime: 0,
    enabled: !!id,
  });
};