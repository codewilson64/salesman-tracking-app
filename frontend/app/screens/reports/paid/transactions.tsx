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
import { useGetPaidTransactions } from "../../../hooks/transaction/useGetPaidTransactions";
import { formatTime } from "../../../helper/formatTime";

import back from "../../../assets/globalIcons/back.png";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import type { Transaction } from "../../../types/transaction";

const TransactionsScreen = () => {
  const router = useRouter();

  const { customerId, shopName } = useLocalSearchParams<{
    customerId: string;
    shopName?: string;
  }>();

  const { data: transactions = [], isLoading, isError } = useGetPaidTransactions({});

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["transactions", "paid"] });
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    return transactions.filter(
      (t: Transaction) => t.customerId === customerId
    );
  }, [transactions, customerId]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.checkInAt).getTime() - new Date(a.checkInAt).getTime()
    );
  }, [filtered]);

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
      <View className="flex-row items-center mb-4">
        <Pressable onPress={() => router.back()} className="mr-3 p-2">
          <Image source={back} className="w-6 h-6" />
        </Pressable>

        <Text className="text-2xl font-bold">
          {shopName || "Transactions"}
        </Text>
      </View>

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
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push(`/screens/reports/paid/${item.id}`)
            }
            className="bg-white p-4 mb-2 rounded-xl flex-row items-center justify-between"
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
              <Text className="text-sm text-green-500 capitalize">
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
      />
    </SafeAreaView>
  );
};

export default TransactionsScreen;