import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markPaidTransactionAsRead } from "../../../services/notification/notificationService";

export const useMarkPaidTransactionAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPaidTransactionAsRead,
    onSuccess: (_, transactionId) => {
      queryClient.invalidateQueries({ queryKey: ["transaction", transactionId] });
      queryClient.invalidateQueries({ queryKey: ["paid-unread-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["paid-unread-customers"] });
      queryClient.invalidateQueries({ queryKey: ["transaction-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["paid-notification-salesmen-counts"] });
    },
    onError: (err) => {
      console.error("Failed to mark transaction as read:", err);
    },
  });
};