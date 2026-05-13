import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markUnpaidNotificationsAsRead } from "../../services/notification/notificationService";

export const useUnpaidNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markUnpaidNotificationsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transaction-notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-visit-count"] });
    },
  });
};