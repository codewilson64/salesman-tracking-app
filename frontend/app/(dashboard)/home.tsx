import { View, Text } from "react-native";
import React from "react";
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";

const Home = () => {
  const router = useRouter();

  const logout = useAuthStore((state) => state.logout)

  const handleLogout =  () => {
    logout()
    router.replace("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navbar onLogout={handleLogout} />

      <View className="p-4">
        <Text>Home Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default Home;