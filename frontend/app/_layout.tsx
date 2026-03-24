import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const RootLayout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(dashboard)" options={{ headerShown: false }} />
            <Stack.Screen name="salesmen" options={{ headerShown: false }}/>
            <Stack.Screen name="products" options={{ headerShown: false }}/>
            <Stack.Screen name="areas" options={{ headerShown: false }}/>
            <Stack.Screen name="customers" options={{ headerShown: false }}/>
        </Stack>
      </QueryClientProvider>
    )
}

export default RootLayout;