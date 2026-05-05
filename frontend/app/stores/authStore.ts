import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser } from "../services/Auth/loginService";
import { signupUser } from "../services/Auth/signupService";
import { TloginSchema, TsignUpSchema } from "../libs/auth.schema";

type User = {
  id: string;
  email: string;
  role: string;
  companyId: string;
  profileImage: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isHydrated: boolean;
  isLoading: boolean;

  login: (data: TloginSchema) => Promise<void>;
  signup: (data: TsignUpSchema) => Promise<void>;
  logout: () => void;

  setHydrated: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isHydrated: false,
      isLoading: true,

      setHydrated: () => set({ isHydrated: true, isLoading: false }),

      login: async (data) => {
        const res = await loginUser(data);
        set({
          user: res.user,
          accessToken: res.accessToken,
        });
      },

      signup: async (data) => {
        const res = await signupUser(data);
        set({
          user: res.user,
          accessToken: res.accessToken,
        });
      },

      logout: () => {
        set({
          user: null,
          accessToken: null,
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);