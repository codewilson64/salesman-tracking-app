import { useQuery } from "@tanstack/react-query";
import { getUnreadPaidTransactions } from "../../../services/notification/notificationService";

type UnreadTransaction = {
  transactionId: string;
};

export const useGetUnreadPaidTransactions = (
  customerId: string
) => {
  return useQuery<UnreadTransaction[]>({
    queryKey: ["paid-unread-transactions", customerId],
    queryFn: () => getUnreadPaidTransactions(customerId),
    enabled: !!customerId,
  });
};