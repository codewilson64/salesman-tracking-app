import { api } from "../../libs/axios";

export type AppVersionResponse = {
  latestVersion: string;
  minimumVersion: string;
  message: string;
  iosUrl: string;
  androidUrl: string;
};

export const getAppVersion = async () => {
  const res = await api.get<AppVersionResponse>("/app-version");
  return res.data;
};