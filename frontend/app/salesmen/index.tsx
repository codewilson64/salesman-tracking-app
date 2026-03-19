// screens/Salesman.tsx
import { View, Text, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSalesmanStore } from "../stores/salesmenStore";
import { useRouter } from "expo-router";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const SalesmanScreen = () => {
  const salesmen = useSalesmanStore((state) => state.salesmen);
  const loading = useSalesmanStore((state) => state.loading);
  const error = useSalesmanStore((state) => state.error);
  const getAllSalesmen = useSalesmanStore((state) => state.getAllSalesmen);

  const router = useRouter()

  useEffect(() => {
    getAllSalesmen();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">List of Salesmen</Text>

      <FlatList
        data={salesmen}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`salesmen/${item.id}`)}
            className="flex-row items-center p-3 border-b border-gray-300"
          >
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  item.name
                )}&background=random&size=64`,
              }}
              className="w-16 h-16 rounded-full mr-4"
            />

            {/* Salesman info */}
            <View className="flex-1">
              <Text className="font-bold text-lg">{item.name}</Text>
              <Text className="text-gray-700">{item.phone}</Text>
              <Text className="text-gray-500">{item.role}</Text>
            </View>
            
            <Pressable
              onPress={() => router.push(`salesmen/edit/${item.id}`)}
              className="absolute bottom-3 right-3 bg-gray-200 p-2 rounded-full"
            >
              <FontAwesome6 name="edit" size={16} color="black" />
            </Pressable>
          </Pressable>
        )}
      />

       {/* CREATE BUTTON */}
      <Pressable
        onPress={() => router.push("/salesmen/create")}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Salesman
        </Text>
      </Pressable>

    </SafeAreaView>
  );
};

export default SalesmanScreen;