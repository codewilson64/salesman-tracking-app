import { useQuery } from "@tanstack/react-query";
import {
  getCurrentConsignmentStock,
  TCurrentConsignmentStockInput,
} from "../../services/consignment/consignmentService";

export const useGetCurrentConsignmentStock = (data: TCurrentConsignmentStockInput) => {
  return useQuery({
    queryKey: ["current-consignment-stock", data.customerId, data.productId],
    queryFn: () => getCurrentConsignmentStock(data),
    enabled: !!data.customerId && !!data.productId,
    staleTime: 1000 * 60,
  });
};