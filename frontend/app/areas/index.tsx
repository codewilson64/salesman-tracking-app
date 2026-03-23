import { View, Text, FlatList, ActivityIndicator, Image, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useGetAllArea } from "../hooks/area/useGetAllAreas";

const AreaScreen = () => {
  const router = useRouter()
  const { data: areas = [], isLoading, isError } = useGetAllArea()

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-lg">Error occurred while fetching areas.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">List of Areas</Text>

      <FlatList
        data={areas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`areas/${item.id}`)}
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

            {/* Area info */}
            <View className="flex-1">
              <Text className="font-bold text-lg capitalize">{item.areaName} | {item.day}</Text>
              <Text className="text-gray-700">{item.salesmanName}</Text>
            </View>
            
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                router.push(`areas/edit/${item.id}`);
              }}
              className="absolute bottom-3 right-3 bg-gray-200 p-2 rounded-full"
            >
              <FontAwesome6 name="edit" size={16} color="black" />
            </Pressable>
          </Pressable>
        )}
      />

       {/* CREATE BUTTON */}
      <Pressable
        onPress={() => router.push("/areas/create")}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Area
        </Text>
      </Pressable>

    </SafeAreaView>
  );
};

export default AreaScreen;