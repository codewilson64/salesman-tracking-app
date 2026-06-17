import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppUpdateChecker } from "./hooks/app-version/useAppUpdateChecker";
import { AppUpdateModal } from "./components/modal/AppUpdateModal";

import * as Notifications from "expo-notifications";

const queryClient = new QueryClient();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

const RootLayout = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const { updateInfo, dismissUpdate } = useAppUpdateChecker();

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={isDark ? "#000" : "#f3f4f6"} // Android only
        />

        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
          <Stack.Screen name="screens/profile/edit" options={{ headerShown: false }} />
          <Stack.Screen name="screens/profile/password" options={{ headerShown: false }} />
          <Stack.Screen name="screens/salesmen" options={{ headerShown: false }}/>
          <Stack.Screen name="screens/products" options={{ headerShown: false }}/>
          <Stack.Screen name="screens/areas" options={{ headerShown: false }}/>
          <Stack.Screen name="screens/customers" options={{ headerShown: false }}/>
          <Stack.Screen name="screens/visits" options={{ headerShown: false }}/>
          <Stack.Screen name="screens/sales-visits" options={{ headerShown: false }}/>
          <Stack.Screen name="screens/reports" options={{ headerShown: false }}/>
        </Stack>

        {updateInfo && (
          <AppUpdateModal
            visible={!!updateInfo}
            type={updateInfo.type}
            message={updateInfo.message}
            updateUrl={updateInfo.updateUrl}
            onDismiss={dismissUpdate}
          />
        )}
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;