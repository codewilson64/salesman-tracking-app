import { useQuery } from "@tanstack/react-query"
import { getAllAreas } from "../../services/area/areaService"
import { useAuthStore } from "../../stores/authStore";

export const useGetAllArea = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["areas", user?.id],
    queryFn: getAllAreas,
    staleTime: 1000 * 60 * 5,
  })
}
