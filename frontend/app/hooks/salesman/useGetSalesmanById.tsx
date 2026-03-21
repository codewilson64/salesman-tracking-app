import { useQuery } from "@tanstack/react-query";
import { getSalesmanById } from "../../services/Salesmen/salesmenService";

export const useGetSalesmanById = (id: string) => {
  return useQuery({
    queryKey: ["salesman", id],
    queryFn: () => getSalesmanById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};