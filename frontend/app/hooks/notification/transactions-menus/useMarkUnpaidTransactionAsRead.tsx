import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markUnpaidTransactionAsRead } from "../../../services/notification/notificationService";

export const useMarkUnpaidTransactionAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markUnpaidTransactionAsRead,
    onSuccess: (_, transactionId) => {
      queryClient.invalidateQueries({ queryKey: ["transaction", transactionId] });
      queryClient.invalidateQueries({ queryKey: ["unpaid-unread-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["unpaid-unread-customers"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unpaid-notification-salesmen-counts"] });
    },
    onError: (err) => {
      console.error("Failed to mark transaction as read:", err);
    },
  });
};