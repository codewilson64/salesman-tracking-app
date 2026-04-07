import { useQuery } from "@tanstack/react-query"
import { getAllVisits } from "../../services/visit/visitService"
import { useAuthStore } from "../../stores/authStore";

export const useGetAllVisits = (filters: {
  startDate?: string; 
  endDate?: string;
}) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["visits", user?.id, filters],
    queryFn: () => getAllVisits(filters),
    staleTime: 1000 * 60 * 5,
  })
}
