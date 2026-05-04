import { useQuery } from "@tanstack/react-query";
import { getMe } from "../../services/Auth/getMeService";
import { useAuthStore } from "../../stores/authStore";
import { User } from "../../types/user";

export const useGetMe = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery<User>({
    queryKey: ["me", user?.id],
    queryFn: getMe,
    staleTime: 1000 * 60 * 5,
  });
};