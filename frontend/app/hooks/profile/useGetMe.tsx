import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/Auth/getMeService";

export const useGetMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
};