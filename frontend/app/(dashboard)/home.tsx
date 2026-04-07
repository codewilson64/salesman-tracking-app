import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import Navbar from "../components/Navbar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";
import { Menus } from "../constants/menu";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
    <SafeAreaView className="flex-1 bg-gray-100">
      <Navbar onLogout={handleLogout} />

      <View className="p-4">
        {filteredMenu.map((item) => (
          <View 
            key={item.id} 
            className="mb-3 bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <TouchableOpacity
              onPress={() => router.push(item.route)}
              className="flex-row items-center p-4 active:opacity-70"
            >
              {/* Left: Icon + Label */}
              <View className="flex-row items-center flex-1">
                <View className="w-16 h-16 justify-center items-center mr-4 overflow-hidden">
                  <Image
                    source={item.icon}
                    className="w-12 h-12"
                    resizeMode="contain"
                  />
                </View>

                <Text className="font-semibold text-lg capitalize">
                  {item.label}
                </Text>
              </View>

              {/* Right: Chevron Arrow */}
              <View>
                <MaterialIcons 
                  name="keyboard-arrow-right" 
                  size={24} 
                  color="#9CA3AF" 
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default Home;