import { useQuery } from "@tanstack/react-query";
import { getUnreadUnpaidTransactions } from "../../../services/notification/notificationService";

type UnreadTransaction = {
  transactionId: string;
};

export const useGetUnreadUnpaidTransactions = (
  customerId: string
) => {
  return useQuery<UnreadTransaction[]>({
    queryKey: ["unpaid-unread-transactions", customerId],
    queryFn: () => getUnreadUnpaidTransactions(customerId),
    enabled: !!customerId,
  });
};