import { useQuery } from "@tanstack/react-query";
import { getTransactionNotificationCounts } from "../../../services/notification/notificationService";

export const useGetTransactionNotificationCounts = () => {
  return useQuery({
    queryKey: ["transaction-notifications"],
    queryFn: getTransactionNotificationCounts,
    refetchIntervalInBackground: false,
    staleTime: 0,
    refetchInterval: 20000,
  });
};