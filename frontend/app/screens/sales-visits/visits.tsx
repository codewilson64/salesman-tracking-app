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
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import back from "../../assets/globalIcons/back.png";

import { useGetAllVisits } from "../../hooks/visit/useGetAllVisits";
import { Visit } from "../../types/visit";
import { getStartEndOfDay } from "../../utils/date";
import { formatTime } from "../../helper/formatTime";
import { getResultStyle } from "../../helper/resultStyle";

const VisitsListScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { salesmanId, date } = useLocalSearchParams<{
    salesmanId: string;
    date: string;
  }>();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["visits"] });
    setRefreshing(false);
  };

  const { startDate, endDate } = useMemo(() => {
    return getStartEndOfDay(date);
  }, [date]);

  const { data: visits = [], isLoading, isError } = useGetAllVisits({
    startDate,
    endDate,
  });

  const salesmanVisits = useMemo(() => {
    return (visits as Visit[]).filter(
      (visit) => visit.salesmanId === salesmanId
    );
  }, [visits, salesmanId]);

  const salesman = salesmanVisits[0];

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
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      {/* HEADER */}
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
            {salesman?.salesmanName ?? "Salesman"}
          </Text>
        </View>
      </View>

      <FlatList
        data={salesmanVisits}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }
        renderItem={({ item, index }) => {
          const style = getResultStyle(item.visitResult);

          return (
            <Pressable
              onPress={() => router.push(`screens/sales-visits/${item.id}`)}
              className="bg-white rounded-xl p-4 mb-3 shadow-sm"
            >
              <View className="flex-row items-start">
                <Text className="w-6 font-bold">
                  {index + 1}.
                </Text>

                <View className="flex-1">
                  <Text className="font-semibold text-base capitalize">
                    {item.shopName}
                  </Text>

                  <Text className="text-sm text-gray-600 mt-1">
                    In: {formatTime(item.checkInAt ?? "")}
                  </Text>

                  {item.checkOutAt && (
                    <Text className="text-sm text-gray-600">
                      Out: {formatTime(item.checkOutAt)}
                    </Text>
                  )}

                  {item.notes && (
                    <Text
                      className="text-sm text-gray-700 mt-2"
                      numberOfLines={2}
                    >
                      Notes: {item.notes}
                    </Text>
                  )}
                </View>

                <View className={`px-3 py-1 rounded self-start ${style.bg}`}>
                  <Text className={`text-xs font-semibold capitalize ${style.text}`}>
                    {item.visitResult || "Checking in..."}
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default VisitsListScreen;