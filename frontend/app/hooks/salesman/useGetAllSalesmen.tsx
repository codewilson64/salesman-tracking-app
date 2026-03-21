import { useQuery } from "@tanstack/react-query"
import { getAllSalesmen } from "../../services/Salesmen/salesmenService"

export const useGetAllSalesmen = () => {
  return useQuery({
    queryKey: ["salesmen"],
    queryFn: getAllSalesmen,
    staleTime: 1000 * 60 * 5,
  })
}
