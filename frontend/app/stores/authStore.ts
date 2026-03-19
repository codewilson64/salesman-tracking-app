import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TloginSchema, TsignUpSchema } from "../../../shared/schemas/types";
import { loginUser } from "../services/Auth/loginService";
import { signupUser } from "../services/Auth/signupService";

type User = {
  id: string;
  username: string;
  email: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  login: (data: TloginSchema) => Promise<void>;
  signup: (data: TsignUpSchema) => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      
      // login
      login: async (data) => {
        const res = await loginUser(data);

        set({
          user: res.user,
          accessToken: res.accessToken,
        });
      },

      // sign up
      signup: async (data) => {
        const res = await signupUser(data)

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
    }
  )
);