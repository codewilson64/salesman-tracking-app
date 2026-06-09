import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { getCurrentAppVersion } from "../../libs/appVersion";
import { getAppVersion } from "../../services/app-version/appVersion.service";
import { compareVersions } from "../../utils/compareVersions";

type UpdateInfo = {
  type: "optional" | "force";
  message: string;
  updateUrl: string;
};

export const useAppUpdateChecker = () => {
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null);
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);

  const checkForUpdate = useCallback(async () => {
    try {
      setIsCheckingUpdate(true);

      const currentVersion = getCurrentAppVersion();
      const appVersion = await getAppVersion();

      const isBelowMinimum =
        compareVersions(currentVersion, appVersion.minimumVersion) < 0;

      const isBelowLatest =
        compareVersions(currentVersion, appVersion.latestVersion) < 0;

      const updateUrl =
        Platform.OS === "ios" ? appVersion.iosUrl : appVersion.androidUrl;

      if (isBelowMinimum) {
        setUpdateInfo({
          type: "force",
          message: appVersion.message,
          updateUrl,
        });

        return;
      }

      if (isBelowLatest) {
        setUpdateInfo({
          type: "optional",
          message: appVersion.message,
          updateUrl,
        });

        return;
      }

      setUpdateInfo(null);
    } catch (error) {
      console.log("Failed to check app update:", error);

      // Important:
      // Do not block user if update check fails.
      setUpdateInfo(null);
    } finally {
      setIsCheckingUpdate(false);
    }
  }, []);

  useEffect(() => {
    checkForUpdate();
  }, [checkForUpdate]);

  const dismissUpdate = () => {
    if (updateInfo?.type === "force") return;
    setUpdateInfo(null);
  };

  return {
    updateInfo,
    isCheckingUpdate,
    checkForUpdate,
    dismissUpdate,
  };
};