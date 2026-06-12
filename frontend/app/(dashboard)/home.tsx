import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";
import { Menus } from "../constants/menu";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useMonitoringDisclosureStore } from "../stores/useMonitoringDisclosureStore";
import { MonitoringDisclosureModal } from "../components/modal/MonitoringDisclosureModal";

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const filteredMenu = Menus.filter((item) => item.roles.includes(user?.role || ""));

  const hasAccepted = useMonitoringDisclosureStore((state) => state.hasAccepted);
  const isLoading = useMonitoringDisclosureStore((state) => state.isLoading);
  const loadDisclosureStatus = useMonitoringDisclosureStore((state) => state.loadDisclosureStatus);
  const acceptDisclosure = useMonitoringDisclosureStore((state) => state.acceptDisclosure);

  useEffect(() => {
    loadDisclosureStatus();
  }, [loadDisclosureStatus]);

  const handleDenyDisclosure = () => {
    Alert.alert(
      "Disclosure Required",
      "This app uses location and photo proof for work visit verification. Please accept the disclosure to continue using visit features."
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
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
                  color="black" 
                />
              </View>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* {user?.role === "salesman" && (
        <Pressable
          onPress={handleCreateVisit}
          className="absolute bottom-6 right-6 bg-black w-16 h-16 rounded-full items-center justify-center shadow-lg active:opacity-80"
        >
          <MaterialIcons name="add" size={32} color="white" />
        </Pressable>
      )} */}

      <MonitoringDisclosureModal
        visible={!isLoading && !hasAccepted}
        onAccept={acceptDisclosure}
        onDeny={handleDenyDisclosure}
      />
    </SafeAreaView>
  );
};

export default Home;