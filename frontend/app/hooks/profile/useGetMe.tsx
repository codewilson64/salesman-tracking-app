import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/Auth/getMeService";
import { useAuthStore } from "../../stores/authStore";

export const useGetMe = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ["me", user?.id],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
};