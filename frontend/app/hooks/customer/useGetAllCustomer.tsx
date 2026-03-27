import { useQuery } from "@tanstack/react-query"
import { getAllCustomers } from "../../services/customer/customerService"
import { useAuthStore } from "../../stores/authStore";

export const useGetAllCustomer = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["customers", user?.id],
    queryFn: getAllCustomers,
    staleTime: 1000 * 60 * 5,
  })
}
