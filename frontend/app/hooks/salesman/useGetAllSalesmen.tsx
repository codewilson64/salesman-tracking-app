import { useQuery } from "@tanstack/react-query"
import { getAllSalesmen } from "../../services/Salesmen/salesmenService"
import { useAuthStore } from "../../stores/authStore";

export const useGetAllSalesmen = (options?: { enabled?: boolean }) => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["salesmen", user?.id],
    queryFn: getAllSalesmen,
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
  })
}
