import { useQuery } from "@tanstack/react-query"
import { getAllVisits } from "../../services/visit/visitService"

export const useGetAllVisits = () => {
  return useQuery({
    queryKey: ["visits"],
    queryFn: getAllVisits,
    staleTime: 1000 * 60 * 5,
  })
}
