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

import VisitFilterModal from "../../components/modal/VisitFilterModal"; 

type FilterOption = "all" | "Order Baru" | "Titip Baru" | "Update Titipan" | "Follow Up" | "Tutup Toko" | "checking in";

const VisitsListScreen = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { salesmanId, date } = useLocalSearchParams<{
    salesmanId: string;
    date: string;
  }>();

  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

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
    return (visits as Visit[])
      .filter((visit) => visit.salesmanId === salesmanId)
      .sort((a, b) => {
        const timeA = new Date(a.checkOutAt ?? a.checkInAt ?? 0).getTime();
        const timeB = new Date(b.checkOutAt ?? b.checkInAt ?? 0).getTime();

        return timeB - timeA;
      });
  }, [visits, salesmanId]);

  const filteredVisits = useMemo(() => {
    if (activeFilter === "all") return salesmanVisits;
    if (activeFilter === "checking in") {
      return salesmanVisits.filter((visit) => !visit.visitResult);
    }
    return salesmanVisits.filter((visit) => visit.visitResult === activeFilter);
  }, [salesmanVisits, activeFilter]);

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
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3 p-2">
            <Image source={back} className="w-6 h-6" resizeMode="contain" />
          </Pressable>

          <Text className="text-2xl font-bold capitalize">
            {salesman?.salesmanName ?? "Salesman"}
          </Text>
        </View>

        {/* Filter Button */}
        <Pressable
          onPress={() => setModalVisible(true)}
          className="bg-white px-5 py-2.5 rounded-2xl flex-row items-center gap-2 shadow-sm border border-gray-200"
        >
          <Text className="font-semibold text-gray-700">
            {activeFilter === "all"
              ? "All"
              : activeFilter === "Order Baru"
              ? "Order Baru"
              : activeFilter === "Titip Baru"
              ? "Titip Baru"
              : activeFilter === "Update Titipan"
              ? "Update Titipan"
              : activeFilter === "Follow Up"
              ? "Follow Up"
              : activeFilter === "Tutup Toko"
              ? "Tutup Toko"
              : "Checking In"}
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filteredVisits}
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
                <Text className="w-6 font-bold">{index + 1}.</Text>

                <Image
                  source={{
                    uri: item.checkInImage
                      ? item.checkInImage
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.shopName || "Visit"
                        )}&background=random&size=128`,
                  }}
                  className="w-20 h-20 rounded-lg mr-3 bg-gray-200"
                  resizeMode="cover"
                />

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
        ListEmptyComponent={
          <View className="py-10 items-center">
            <Text className="text-gray-500">No visits found for this filter.</Text>
          </View>
        }
      />

      {/* Use the separate modal component */}
      <VisitFilterModal
        visible={modalVisible}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default VisitsListScreen;