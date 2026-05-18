import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markPaidNotificationsBySalesmanAsRead } from "../../../services/notification/notificationService";

export const usePaidNotificationsBySalesmanAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (salesmanId: string) => markPaidNotificationsBySalesmanAsRead(salesmanId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["paid-notification-salesmen-counts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions", "paid"] });
    },
  });
};