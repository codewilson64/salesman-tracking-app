import {
  Text,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import back from "../../../assets/globalIcons/back.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useGetTransactionById } from "../../../hooks/transaction/useGetTransactionById";
import { formatTime } from "../../../helper/formatTime";

const TransactionDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: transaction, isLoading } = useGetTransactionById(id);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["transaction", id] });
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
    }

  if (!transaction) {
      return (
        <View className="flex-1 justify-center items-center">
            <Text>Transaction not found</Text>
        </View>
      );
    }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <SafeAreaView className="flex-1">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24 }}
          refreshControl={
            <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#2563EB"]} // optional: Android spinner color
                tintColor="#2563EB"  // optional: iOS spinner color
            />
          }
        >
          {/* HEADER */}
          <View className="flex-row items-center mb-8">
            <Pressable onPress={() => router.back()} className="mr-3">
              <Image source={back} className="w-6 h-6" />
            </Pressable>

            <Text className="text-2xl font-bold">Transaction Detail</Text>
          </View>

          <View className="gap-4">
            {/* Date of visit */}
            <View>
              <Text className="text-gray-500">Date of visit</Text>
              <Text className="text-lg font-semibold">
                {formatTime(transaction.checkInAt)}
              </Text>
            </View>

            {/* SHOP NAME */}
            <View>
              <Text className="text-gray-500">Shop</Text>
              <Text className="text-lg font-semibold">
                {transaction.shopName}
              </Text>
            </View>

            {/* TRANSACTION TYPE */}
            <View>
              <Text className="text-gray-500">Transaction Type</Text>
              <Text className="font-semibold capitalize">
                {transaction.transactionType}
              </Text>
            </View>

            {/* Payment Status */}
            <View>
              <Text className="text-gray-500">Payment Status</Text>
              <Text className="font-semibold capitalize">
                {transaction.paymentStatus}
              </Text>
            </View>

            {/* FINAL AMOUNT */}
            <View>
              <Text className="text-gray-500 mb-1">Final Amount</Text>
              <View className="p-3 bg-gray-100 rounded-lg">
                <Text className="font-semibold">
                  Rp {Number(transaction.finalAmount).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* REMAINING */}
            <View>
              <Text className="text-gray-500 mb-1">Remaining</Text>
              <View className="p-3 bg-gray-100 rounded-lg">
                <Text className="font-semibold text-red-500">
                  Rp {Number(transaction.remainingAmount).toLocaleString()}
                </Text>
              </View>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default TransactionDetailScreen;