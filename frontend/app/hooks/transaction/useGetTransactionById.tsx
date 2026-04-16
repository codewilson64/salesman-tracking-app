import { useQuery } from "@tanstack/react-query";
import { getTransactionById } from "../../services/transaction/transactionService";
import { Transaction } from "../../types/transaction";

export const useGetTransactionById = (id: string) => {
  return useQuery<Transaction>({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};