import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markVisitsReportsAsRead } from "../../services/notification/notificationService";

export const useMarkVisitsReportsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markVisitsReportsAsRead,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unread-visits"] });
    },
  });
};