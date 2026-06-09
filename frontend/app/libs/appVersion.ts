import Constants from "expo-constants";

export const getCurrentAppVersion = () => {
  return Constants.expoConfig?.version ?? "0.0.0";
};