import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "../../services/customer/customerService";

export const useGetCustomerById = (id: string) => {
  return useQuery({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};