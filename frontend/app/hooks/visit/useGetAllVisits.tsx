import { useQuery } from "@tanstack/react-query"
import { getAllVisits } from "../../services/visit/visitService"
import { useAuthStore } from "../../stores/authStore";

export const useGetAllVisits = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["visits", user?.id],
    queryFn: getAllVisits,
    staleTime: 1000 * 60 * 5,
  })
}
