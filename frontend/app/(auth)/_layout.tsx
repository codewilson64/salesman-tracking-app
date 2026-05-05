import { Stack } from "expo-router/build/layouts/Stack";
import GuestOnly from "../components/auth/GuestOnly";

export default function AuthLayout() {
    return (
      <GuestOnly>
        <Stack screenOptions={{ headerShown: false }} />
      </GuestOnly>
    )
}