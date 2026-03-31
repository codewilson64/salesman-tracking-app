import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "../../services/customer/customerService";
import { Customer } from "../../types/customer";

export const useGetCustomerById = (id: string) => {
  return useQuery<Customer>({
    queryKey: ["customer", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};