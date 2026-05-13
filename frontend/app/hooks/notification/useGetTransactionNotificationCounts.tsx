import { useQuery } from "@tanstack/react-query";
import { getTransactionNotificationCounts } from "../../services/notification/notificationService";

export const useGetTransactionNotificationCounts = () => {
  return useQuery({
    queryKey: ["transaction-notifications"],
    queryFn: getTransactionNotificationCounts,
    refetchInterval: 10000,
  });
};