import { useQuery } from "@tanstack/react-query";
import { getUnreadUnpaidCustomers } from "../../../services/notification/notificationService";

type UnreadCustomer = {
  customerId: string;
};

export const useGetUnreadUnpaidCustomers = (salesmanId: string) => {
  return useQuery<UnreadCustomer[]>({
    queryKey: ["unpaid-unread-customers", salesmanId],
    queryFn: () => getUnreadUnpaidCustomers(salesmanId),
    enabled: !!salesmanId,
  });
};