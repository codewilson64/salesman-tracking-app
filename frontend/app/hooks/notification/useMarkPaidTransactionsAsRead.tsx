import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markPaidNotificationsAsRead } from "../../services/notification/notificationService";

export const usePaidNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markPaidNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-visit-count"] });
    },
  });
};