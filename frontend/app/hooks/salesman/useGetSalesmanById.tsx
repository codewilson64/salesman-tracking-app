import { useQuery } from "@tanstack/react-query";
import { getSalesmanById } from "../../services/Salesmen/salesmenService";


export const useGetSalesmanById = (id: string | undefined, options: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["salesman", id],
    queryFn: () => getSalesmanById(id as string),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5,
  });
};