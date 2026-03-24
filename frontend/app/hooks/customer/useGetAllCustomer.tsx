import { useQuery } from "@tanstack/react-query"
import { getAllCustomers } from "../../services/customer/customerService"

export const useGetAllCustomer = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
  })
}
