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
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import back from '../../../assets/globalIcons/back.png'
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { groupCustomersBySalesman } from "../../../utils/groupBy/sales";
import { Customer } from "../../../types/customer";
import { useGetAllCustomer } from "../../../hooks/customer/useGetAllCustomer";
import { useGetPaidNotificationCountsBySalesman } from "../../../hooks/notification/salesmen-menus/useGetPaidNotificationCountsBySalesman";

const SalesmenScreen = () => {
  const router = useRouter();

  const { data: customers = [], isLoading, isError } = useGetAllCustomer();
  const { data: notifications = [] } = useGetPaidNotificationCountsBySalesman();
  
  const notificationMap = useMemo(() => {
    return Object.fromEntries(
        notifications.map((item) => [
          item.salesmanId,
          Number(item.count),
        ])
    );
  }, [notifications]);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["transactions", "paid"] });
    setRefreshing(false);
  };

  const grouped = useMemo(() => {
    return groupCustomersBySalesman(customers as Customer[]);
  }, [customers]);

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
          Failed to load payments
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
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

        <Text className="text-2xl font-bold">Transaksi Lunas</Text>
      </View>

      <FlatList
        data={grouped}
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
          const notificationCount = notificationMap[item.salesmanId] || 0;

          return (
            <View className="p-2 mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
              {/* CUSTOMER HEADER */}
              <Pressable
                onPress={() =>
                router.push({
                  pathname: "screens/reports/paid/customers",
                  params: {
                  salesmanId: item.salesmanId,
                  salesmanName: item.salesmanName,
                },
                })
              }
                className="flex-row items-center justify-between py-3 px-1"
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
                  </View>
                </View>

                <View className="flex-row items-center">
                  {notificationCount > 0 && (
                    <View className="min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full items-center justify-center mr-2">
                      <Text className="text-white text-xs font-bold">
                        {notificationCount > 99
                          ? "99+"
                          : notificationCount}
                      </Text>
                    </View>
                  )}

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
    </SafeAreaView>
  );
};

export default SalesmenScreen;