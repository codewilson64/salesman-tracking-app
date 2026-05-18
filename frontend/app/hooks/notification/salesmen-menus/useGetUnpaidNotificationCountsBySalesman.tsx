import { useQuery } from "@tanstack/react-query";
import { getUnpaidNotificationCountsBySalesman } from "../../../services/notification/notificationService";
import { SalesmanNotificationCount } from "../../../types/notification";

export const useGetUnpaidNotificationCountsBySalesman = () => {
  return useQuery<SalesmanNotificationCount[]>({
    queryKey: ["unpaid-notification-salesmen-counts"],
    queryFn: getUnpaidNotificationCountsBySalesman,
    refetchInterval: 10000,
  });
};