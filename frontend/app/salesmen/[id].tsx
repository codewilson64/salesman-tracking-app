import { View, Text, ActivityIndicator, Image } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { useSalesmanStore } from "../stores/salesmenStore";
import { SafeAreaView } from "react-native-safe-area-context";

const SalesmanDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectedSalesmen, loading, error, getSalesmanById } = useSalesmanStore();

  useEffect(() => {
    if (id) {
      getSalesmanById(id);
    }
  }, [id]);

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
        <Text className="text-red-500">{error}</Text>
      </View>
    );
  }

  if (!selectedSalesmen) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Salesman not found</Text>
      </View>
    );
  }

  const salesmen = selectedSalesmen;

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/* Avatar */}
      <View className="items-center mb-6">
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              salesmen.name
            )}&size=128`,
          }}
          className="w-32 h-32 rounded-full mb-4"
        />
        <Text className="text-2xl font-bold">{salesmen.name}</Text>
        <Text className="text-gray-500">{salesmen.role}</Text>
      </View>

      {/* Info */}
      <View className="mt-4">
        {/* Phone */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Phone</Text>
            <Text className="text-lg font-medium">{salesmen.phone}</Text>
            </View>
        </View>

        {/* Email */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Email</Text>
            <Text className="text-lg font-medium">{salesmen.email}</Text>
            </View>
        </View>

        {/* Address */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Address</Text>
            <Text className="text-lg font-medium">{salesmen.address}</Text>
            </View>
        </View>
        </View>
    </SafeAreaView>
  );
};

export default SalesmanDetail;