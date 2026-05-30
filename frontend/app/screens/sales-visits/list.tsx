import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";

import { useGetAllVisits } from "../../hooks/visit/useGetAllVisits";
import { Visit } from "../../types/visit";
import { useMemo, useState } from "react";
import { getStartEndOfDay } from "../../utils/date";
import { groupVisitsBySalesman } from "../../utils/groupBy/sales";

import back from '../../assets/globalIcons/back.png'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const SalesmenListScreen = () => {
  const { date } = useLocalSearchParams();
  const router = useRouter();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["visits"] });
    setRefreshing(false);
  };

  const { startDate, endDate } = useMemo(() => {
    return getStartEndOfDay(date as string);
  }, [date]);

  const { data: visits = [], isLoading, isError } = useGetAllVisits({
    startDate,
    endDate,
  });

  const groupedVisits = useMemo(() => {
    return groupVisitsBySalesman(visits as Visit[]);
  }, [visits]);

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
          Error occurred while fetching visits.
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

        <Text className="text-2xl font-bold">Sales visits overview</Text>
      </View>

      <FlatList
        data={groupedVisits}
        keyExtractor={(item) => item.salesmanId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]} // optional: Android spinner color
            tintColor="#2563EB"  // optional: iOS spinner color
          />
        }
        renderItem={({ item }) => {
          return (
            <View className="p-2 mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
              {/* SALESMAN HEADER */}
              <Pressable
                onPress={() => router.push({
                    pathname: "screens/sales-visits/visits",
                    params: {
                      salesmanId: item.salesmanId,
                      date: date as string,
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
                      {item.visits.length} visit{item.visits.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                {/* Chevron Icon */}
                <MaterialIcons
                  name="keyboard-arrow-right"
                  size={24}
                  color="black"
                />
              </Pressable>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default SalesmenListScreen;