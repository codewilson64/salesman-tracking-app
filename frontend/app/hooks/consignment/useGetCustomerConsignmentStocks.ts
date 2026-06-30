import { useQuery } from "@tanstack/react-query";
import { getCustomerConsignmentStocks } from "../../services/consignment/consignmentService";
import { CustomerConsignmentStock } from "../../types/consignment";

export const useGetCustomerConsignmentStocks = (customerId?: string) => {
  return useQuery<CustomerConsignmentStock[]>({
    queryKey: ["customer-consignment-stocks", customerId],
    queryFn: () => getCustomerConsignmentStocks(customerId as string),
    enabled: !!customerId,
    staleTime: 1000 * 60,
  })
};