import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";

import back from "../../assets/globalIcons/back.png";

import { useGetAllArea } from "../../hooks/area/useGetAllAreas";
import { Area } from "../../types/area";

const AreasListScreen = () => {
  const router = useRouter();

  const { salesmanId, salesmanName } = useLocalSearchParams<{
    salesmanId: string;
    salesmanName: string;
  }>();

  const { data: areas = [], isLoading, isError } = useGetAllArea();

  const salesmanAreas = useMemo(() => {
    return (areas as Area[]).filter(
      (area) => area.salesmanId === salesmanId
    );
  }, [areas, salesmanId]);

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
        <Text className="text-red-500 text-lg">
          Error occurred while fetching areas.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
      <View className="flex-row items-center mb-4">
        <Pressable
          onPress={() => router.back()}
          className="mr-3 p-2"
        >
          <Image
            source={back}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </Pressable>

        <View>
          <Text className="text-2xl font-bold capitalize">
            {salesmanName}
          </Text>
        </View>
      </View>

      <FlatList
        data={salesmanAreas}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`screens/areas/${item.id}`)}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row items-center">
              <Text className="w-6 font-bold">
                {index + 1}.
              </Text>

              <View className="flex-1">
                <Text className="font-semibold capitalize">
                  {item.areaName}
                </Text>

                <Text className="text-sm text-gray-500">
                  {item.day}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default AreasListScreen;