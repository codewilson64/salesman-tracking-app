import { useQuery } from "@tanstack/react-query";
import { getSalesmenById } from "../../services/Salesmen/salesmenService";

export const useGetSalesmanById = (id: string) => {
  return useQuery({
    queryKey: ["salesman", id],
    queryFn: () => getSalesmenById(id),
    enabled: !!id, // prevents undefined errors
  });
};