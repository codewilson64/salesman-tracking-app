import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";
import { Menus } from "../constants/menu";

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const filteredMenu = Menus.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navbar onLogout={handleLogout} />

      <View className="p-2">
        {filteredMenu.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => router.push(item.route)}
            className="flex-row items-center p-3 border-b border-gray-300 rounded-md mb-2 justify-between"
          >
            {/* Left: icon + label */}
            <View className="flex-row items-center">
              <View className="w-16 h-16 rounded-full justify-center items-center mr-4 overflow-hidden">
                <Image
                  source={item.icon}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>

              <Text className="font-semibold text-lg">
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Home;