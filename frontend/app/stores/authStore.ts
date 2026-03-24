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
        try {
          const res = await loginUser(data);

          set({
            user: res.user,
            accessToken: res.accessToken,
          });
        } catch (error: any) {
          console.log("LOGIN ERROR:", error);
          throw error;
        }
      },

      // sign up
      signup: async (data) => {
        try {
          const res = await signupUser(data);

          set({
            user: res.user,
            accessToken: res.accessToken,
          });
        } catch (error: any) {
          console.log("SIGNUP ERROR:", error);
          throw error;
        }
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