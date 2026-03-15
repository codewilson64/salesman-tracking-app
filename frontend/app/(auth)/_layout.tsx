import { Stack } from "expo-router/build/layouts/Stack";

export default function AuthLayout() {
    return (
      <>
        <Stack
            screenOptions={{ headerShown: false }}
        />
      </>
    )
}