import { useQuery } from "@tanstack/react-query";
import { getUnreadVisitsCount } from "../../../services/notification/notificationService";

export const useGetUnreadVisitsCount = () => {
  return useQuery({
    queryKey: ["unread-visit-count"],
    queryFn: getUnreadVisitsCount,
    refetchIntervalInBackground: false,
    staleTime: 0,
    refetchInterval: 20000,
  });
};