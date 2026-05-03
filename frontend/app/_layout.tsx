import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar, useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

const RootLayout = () => {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

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
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default RootLayout;