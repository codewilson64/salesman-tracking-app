import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGetAllArea } from "../../hooks/area/useGetAllAreas";
import { Area } from "../../types/area";
import { useMemo } from "react";

import back from '../../assets/globalIcons/back.png'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { useExpand } from "../../hooks/useExpand";
import { groupAreasBySalesman } from "../../utils/groupBy/sales";

const AreaScreen = () => {
  const router = useRouter();

  const { data: areas = [], isLoading, isError } = useGetAllArea();

  const groupedAreas = useMemo(() => {
    return groupAreasBySalesman(areas as Area[]);
  }, [areas]);

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

        <Text className="text-2xl font-bold">List of areas</Text>
      </View>

      <FlatList
        data={groupedAreas}
        keyExtractor={(item) => item.salesmanId} // Better to use salesmanId if available
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          return (
            <View className="p-2 mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
              {/* SALESMAN HEADER */}
              <Pressable
                onPress={() => router.push({
                    pathname: "screens/areas/list",
                    params: {
                      salesmanId: item.salesmanId,
                      salesmanName: item.salesmanName,
                    },
                  })
                }
                className="flex-row items-center justify-between py-3 px-1 active:opacity-70"
              >
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{
                      uri:
                        item.salesmanImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.salesmanName
                        )}&background=random&size=64`,
                    }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View>
                    <Text className="text-xl font-bold capitalize">
                      {item.salesmanName}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.areas.length} area{item.areas.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                {/* Chevron Icon */}
                <View className="ml-2">
                  <MaterialIcons 
                    name="keyboard-arrow-right"
                    size={24} 
                    color="black" 
                  />
                </View>
              </Pressable>
            </View>
          );
        }}
      />

      {/* CREATE BUTTON */}
      <Pressable
        onPress={() => router.push("screens/areas/create")}
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