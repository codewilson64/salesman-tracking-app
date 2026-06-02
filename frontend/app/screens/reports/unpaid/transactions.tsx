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
import { formatTime } from "../../../helper/formatTime";

import back from "../../../assets/globalIcons/back.png";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import filterIcon from "../../../assets/globalIcons/filter.png";

import type { Transaction } from "../../../types/transaction";
import { useGetOutstandingTransactions } from "../../../hooks/transaction/useGetOutstandingTransactions";
import { useGetUnreadUnpaidTransactions } from "../../../hooks/notification/transactions-menus/useGetUnreadUnpaidTransactions";
import { useDateFilter } from "../../../hooks/useDateFilter";
import DateFilterModal from "../../../components/modal/DateFilterModal";

const TransactionsScreen = () => {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);

  const { customerId, shopName } = useLocalSearchParams<{
    customerId: string;
    shopName?: string;
  }>();

  const { data: transactions = [], isLoading, isError } = useGetOutstandingTransactions({});

  const { data: unreadTransactions = [] } = useGetUnreadUnpaidTransactions(customerId);
  
  const unreadMap = useMemo(() => {
    return Object.fromEntries(
      unreadTransactions.map((item) => [
        item.transactionId,
        true,
      ])
    );
  }, [unreadTransactions]);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["transactions", "unpaid"] });
    setRefreshing(false); 
  };

  const filtered = useMemo(() => {
    return transactions.filter(
      (t) => t.customerId === customerId
    );
  }, [transactions, customerId]);

  const {
      filteredData,
      filter,
      setDateRange,
      resetFilter,
      hasActiveFilter,
    } = useDateFilter({
      data: filtered,
      getDate: (transaction) => transaction.checkInAt,
    });

    const sorted = useMemo(() => {
      return [...filteredData].sort(
        (a, b) =>
          new Date(b.checkInAt).getTime() -
          new Date(a.checkInAt).getTime()
      );
    }, [filteredData]);

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
          Failed to load transactions
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
      {/* HEADER */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="mr-3 p-2">
            <Image source={back} className="w-6 h-6" />
          </Pressable>
      
          <Text className="text-2xl font-bold">
            {shopName || "Transactions"}
          </Text>
        </View>
      
        <Pressable
          onPress={() => setModalVisible(true)}
          className="p-2 relative"
        >
          <Image
            source={filterIcon}
            className="w-6 h-6"
            resizeMode="contain"
          />
      
          {hasActiveFilter && (
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </Pressable>
      </View>

      {hasActiveFilter && (
        <View className="bg-blue-50 p-3 rounded-xl mb-4 flex-row justify-between items-center">
          <Text className="text-blue-700 text-sm">
            {filter.startDate?.toLocaleDateString("id-ID")} —{" "}
            {filter.endDate?.toLocaleDateString("id-ID")}
          </Text>

          <Pressable onPress={resetFilter}>
            <Text className="text-blue-600 font-semibold">
              Reset
            </Text>
          </Pressable>
        </View>
      )}

      <FlatList
        data={sorted}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        renderItem={({ item }) => {
          const isUnread = unreadMap[item.id];

          return  (
            <Pressable
              onPress={() =>
                router.push(`/screens/reports/unpaid/edit/${item.id}`)
              }
              className={`p-4 mb-2 rounded-xl flex-row items-center justify-between border ${
                isUnread
                  ? "bg-orange-50 border-orange-200"
                  : "bg-white border-transparent"
              }`}
            >
              {/* LEFT */}
              <View className="flex-row items-center flex-1">
                <View>
                  <Text className="font-semibold">
                      Rp {Number(item.finalAmount).toLocaleString()}
                  </Text>

                  <Text className="text-gray-500 text-sm">
                    {formatTime(item.checkInAt)}
                  </Text>
                </View>
              </View>

              {/* RIGHT */}
              <View className="items-end mr-2">
                <Text
                  className={`text-sm capitalize ${
                    item.paymentStatus === "partial"
                      ? "text-yellow-500"
                      : item.paymentStatus === "unpaid"
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                  >
                    {item.paymentStatus}
                  </Text>
              </View>

              {/* ARROW */}
              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color="black"
              />
            </Pressable>
          )}
        } 
      />

      <DateFilterModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onApply={setDateRange}
        initialFilter={filter}
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;