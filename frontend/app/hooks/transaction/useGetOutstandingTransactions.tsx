import { useQuery } from "@tanstack/react-query"
import { useAuthStore } from "../../stores/authStore";
import { getOutstandingTransactions } from "../../services/transaction/transactionService";

export const useGetOutstandingTransactions = (filters: {
  startDate?: string; 
  endDate?: string;
}) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["transactions", user?.id, filters],
    queryFn: () => getOutstandingTransactions(filters),
    staleTime: 1000 * 60 * 5,
  })
}
