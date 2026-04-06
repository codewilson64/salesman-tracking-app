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
            <Stack.Screen name="screens/salesmen" options={{ headerShown: false }}/>
            <Stack.Screen name="screens/products" options={{ headerShown: false }}/>
            <Stack.Screen name="screens/areas" options={{ headerShown: false }}/>
            <Stack.Screen name="screens/customers" options={{ headerShown: false }}/>
            <Stack.Screen name="screens/visits" options={{ headerShown: false }}/>
            <Stack.Screen name="screens/sales-visits" options={{ headerShown: false }}/>
        </Stack>
      </QueryClientProvider>
    )
}

export default RootLayout;