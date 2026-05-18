import { useQuery } from "@tanstack/react-query";
import { getUnreadPaidCustomers } from "../../../services/notification/notificationService";

type UnreadCustomer = {
  customerId: string;
};

export const useGetUnreadPaidCustomers = (salesmanId: string) => {
  return useQuery<UnreadCustomer[]>({
    queryKey: ["paid-unread-customers", salesmanId],
    queryFn: () => getUnreadPaidCustomers(salesmanId),
    enabled: !!salesmanId,
  });
};