import { useQuery } from "@tanstack/react-query";
import { getPaidNotificationCountsBySalesman } from "../../services/notification/notificationService";
import { SalesmanNotificationCount } from "../../types/notification";

export const useGetPaidNotificationCountsBySalesman = () => {
  return useQuery<SalesmanNotificationCount[]>({
    queryKey: ["paid-notification-salesmen-counts"],
    queryFn: getPaidNotificationCountsBySalesman,
    refetchInterval: 10000,
  });
};