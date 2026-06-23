import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";
import { Menus } from "../constants/menu";

import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Visit } from "../types/visit";
import { useGetAllVisits } from "../hooks/visit/useGetAllVisits";
import { debugOfflineVisits, getActiveOfflineVisit, resetOfflineVisitDb } from "../db/offlineVisits";
import { debugOfflineCatalog } from "../db/offlineCatalog/debugOfflineCatalog";

const Home = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [isCheckingActiveVisit, setIsCheckingActiveVisit] = useState(false);

  const filteredMenu = Menus.filter((item) => item.roles.includes(user?.role || ""));

  const { data: visits = [], isLoading, isError } = useGetAllVisits({});

  const handleCreateVisit = async () => {
      try {
        setIsCheckingActiveVisit(true);
  
        // const activeOfflineVisit = await getActiveOfflineVisit();
  
        const hasActiveOnlineVisit = visits?.some((v: Visit) => v.checkOutAt === null);
  
        if (hasActiveOnlineVisit) {
          Alert.alert(
            "Finish Visit First",
            "Please checkout your current visit before adding a new one."
          );
          return;
        }
  
        router.push("screens/visits/create");
      } 
      catch (error) {
        console.log("Failed to check active visit:", error);
  
        Alert.alert(
          "Error",
          "Unable to check active visit. Please try again."
        );
      } 
      finally {
        setIsCheckingActiveVisit(false);
      }
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

      {/* <Pressable onPress={debugOfflineVisits}>
        <Text>Debug Offline Visits</Text>
      </Pressable>

      <Pressable onPress={resetOfflineVisitDb}>
        <Text>Reset Offline Visits</Text>
      </Pressable>

      <Pressable onPress={debugOfflineCatalog}>
        <Text>Debug Offline Catalogs</Text>
      </Pressable> */}

      {user?.role === "salesman" && (
        <Pressable
          onPress={handleCreateVisit}
          className="absolute bottom-6 right-6 bg-black w-16 h-16 rounded-full items-center justify-center shadow-lg active:opacity-80"
        >
          <MaterialIcons name="add" size={32} color="white" />
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default Home;