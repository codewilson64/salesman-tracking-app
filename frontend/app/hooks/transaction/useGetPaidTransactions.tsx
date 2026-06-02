import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../stores/authStore";
import { getPaidTransactions } from "../../services/transaction/transactionService";
import { Transaction } from "../../types/transaction";

export const useGetPaidTransactions = (filters: {
  startDate?: string; 
  endDate?: string;
}) => {
  const user = useAuthStore((state) => state.user);

  return useQuery<Transaction[]>({
    queryKey: ["transactions", "paid", user?.id, filters],
    queryFn: () => getPaidTransactions(filters),
    staleTime: 1000 * 60 * 5,
  })
}
