import {
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "expo-router";
import { ReportMenus } from "../constants/reportMenus";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useGetTransactionNotificationCounts } from "../hooks/notification/useGetTransactionNotificationCounts";
import { useQueryClient } from "@tanstack/react-query";

const Reports = () => {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const { data } = useGetTransactionNotificationCounts();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["transaction-notifications"] }),
      queryClient.invalidateQueries({ queryKey: ["unread-visit-count"] }),
    ]);
    setRefreshing(false);
  };

  const filteredMenu = ReportMenus.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >
        {filteredMenu.map((item) => {
          const notificationCount =
            item.notificationType === "paid"
              ? data?.paid || 0
              : data?.unpaid || 0;

          return (
            <View
              key={item.id}
              className="mb-3 bg-white rounded-xl shadow-sm overflow-hidden"
            >
              <TouchableOpacity
                onPress={() => router.push(item.route)}
                className="flex-row items-center p-4 active:opacity-70"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-16 h-16 justify-center items-center mr-4 relative">
                    <Image
                      source={item.icon}
                      className="w-12 h-12"
                      resizeMode="contain"
                    />
                  </View>

                  <Text className="font-semibold text-lg capitalize">
                    {item.label}
                  </Text>
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
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reports;