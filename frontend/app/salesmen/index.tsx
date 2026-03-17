// screens/Salesman.tsx
import { View, Text, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSalesmanStore } from "../stores/salesmenStore";
import { useRouter } from "expo-router";

const SalesmanScreen = () => {
  const { salesmen, loading, error, getAllSalesmen } = useSalesmanStore();
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
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default SalesmanScreen;