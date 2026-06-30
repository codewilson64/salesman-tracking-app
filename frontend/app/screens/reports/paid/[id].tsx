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
  TouchableOpacity,
} from "react-native";
import back from "../../../assets/globalIcons/back.png";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import { useGetTransactionById } from "../../../hooks/transaction/useGetTransactionById";
import { formatTime } from "../../../helper/formatTime";
import { useAuthStore } from "../../../stores/authStore";
import { useMarkPaidTransactionAsRead } from "../../../hooks/notification/transactions-menus/useMarkPaidTransactionAsRead";

const TransactionDetailScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const user = useAuthStore((state) => state.user);

  const { data: transaction, isLoading } = useGetTransactionById(id);

  const { mutate } = useMarkPaidTransactionAsRead();

  useEffect(() => {
    if (id) mutate(id);
  }, [id, mutate]);

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

            <Text className="text-2xl font-bold">Detail Transaksi</Text>
          </View>

          <View className="gap-4">
            {/* Salesman */}
            <View>
              <Text className="text-gray-500 mb-1">Salesman</Text>
              <Text className="font-semibold">
                {transaction.salesmanName}
              </Text>
            </View>

            {/* Tanggal Kunjungan */}
            <View>
              <Text className="text-gray-500 mb-1">Tanggal Kunjungan</Text>
              <Text className="font-semibold">
                {formatTime(transaction.checkInAt)}
              </Text>
            </View>

            {/* Toko */}
            <View>
              <Text className="text-gray-500 mb-1">Toko</Text>
              <Text className="font-semibold">
                {transaction.shopName}
              </Text>
            </View>

            {/* Tipe Transaksi */}
            <View>
              <Text className="text-gray-500 mb-1">Tipe Transaksi</Text>
              <Text className="font-semibold capitalize">
                {transaction.transactionType}
              </Text>
            </View>

            {/* Status Pembayaran */}
            <View>
              <Text className="text-gray-500 mb-1">Status Pembayaran</Text>
              <Text className="font-semibold capitalize">
                {transaction.paymentStatus}
              </Text>
            </View>

            {/* Tanggal Pembayaran */}
            <View>
              <Text className="text-gray-500 mb-1">Tanggal Pembayaran</Text>
              <Text className="font-semibold">
                {formatTime(transaction.paidAt)}
              </Text>
            </View>

            {/* Total Transaksi */}
            <View>
              <Text className="text-gray-500 mb-1">Total Transaksi</Text>
              <View className="p-3 bg-gray-100 rounded-lg">
                <Text className="font-semibold">
                  Rp {Number(transaction.finalAmount).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Sisa Tagihan */}
            <View>
              <Text className="text-gray-500 mb-1">Sisa Tagihan</Text>
              <View className="p-3 bg-gray-100 rounded-lg">
                <Text className="font-semibold text-red-500">
                  Rp {Number(transaction.remainingAmount).toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => router.push(
                  user?.role === "salesman"
                    ? `screens/visits/${transaction.visitId}`
                    : `screens/sales-visits/${transaction.visitId}`
                )
              }
              className="flex-row items-center active:opacity-70 mb-8"
            >
              <View className="flex-row items-center flex-1">
                <Text className="font-normal text-blue-600 text-lg underline">
                  Lihat Detail Kunjungan
                </Text>
              </View>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default TransactionDetailScreen;