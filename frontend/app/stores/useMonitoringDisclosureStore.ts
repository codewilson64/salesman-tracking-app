import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const MONITORING_DISCLOSURE_KEY = "monitoring_disclosure_v1";

type MonitoringDisclosureState = {
  hasAccepted: boolean;
  isLoading: boolean;
  loadDisclosureStatus: () => Promise<void>;
  acceptDisclosure: () => Promise<void>;
  resetDisclosure: () => Promise<void>;
};

export const useMonitoringDisclosureStore =
  create<MonitoringDisclosureState>((set) => ({
    hasAccepted: false,
    isLoading: true,

    loadDisclosureStatus: async () => {
      try {
        const value = await AsyncStorage.getItem(MONITORING_DISCLOSURE_KEY);

        set({
          hasAccepted: value === "accepted",
          isLoading: false,
        });
      } catch {
        set({
          hasAccepted: false,
          isLoading: false,
        });
      }
    },

    acceptDisclosure: async () => {
      await AsyncStorage.setItem(MONITORING_DISCLOSURE_KEY, "accepted");

      set({
        hasAccepted: true,
      });
    },

    resetDisclosure: async () => {
      await AsyncStorage.removeItem(MONITORING_DISCLOSURE_KEY);

      set({
        hasAccepted: false,
      });
    },
  }));