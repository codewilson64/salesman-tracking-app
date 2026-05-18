import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markUnpaidNotificationsBySalesmanAsRead } from "../../../services/notification/notificationService";

export const useUnpaidNotificationsBySalesmanAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (salesmanId: string) => markUnpaidNotificationsBySalesmanAsRead(salesmanId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unpaid-notification-salesmen-counts",] });
      queryClient.invalidateQueries({ queryKey: ["transactions", "unpaid"] });
    },
  });
};