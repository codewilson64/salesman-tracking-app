import { useQuery } from "@tanstack/react-query"
import { getAllAreas } from "../../services/area/areaService"

export const useGetAllArea = () => {
  return useQuery({
    queryKey: ["areas"],
    queryFn: getAllAreas,
  })
}
