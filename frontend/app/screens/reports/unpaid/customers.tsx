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
import { useGetOutstandingTransactions } from "../../../hooks/transaction/useGetOutstandingTransactions";
import { groupTransactionsByCustomer } from "../../../utils/groupBy/customers";

import back from '../../../assets/globalIcons/back.png'
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Transaction } from "../../../types/transaction";
import { useGetUnreadUnpaidCustomers } from "../../../hooks/notification/customers-menus/useGetUnreadUnpaidCustomers";

const CustomersScreen = () => {
  const router = useRouter();

  const { salesmanId, salesmanName } = useLocalSearchParams<{ 
    salesmanId: string, 
    salesmanName: string 
  }>();

  const { data: transactions = [], isLoading, isError } = useGetOutstandingTransactions({});

  const { data: unreadCustomers = [] } = useGetUnreadUnpaidCustomers(salesmanId);
  
  const unreadMap = useMemo(() => {
      return Object.fromEntries(
        unreadCustomers.map((item) => [
          item.customerId,
          true,
        ])
      );
  }, [unreadCustomers]);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["transactions", "unpaid"] });
    setRefreshing(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (t: Transaction) => t.salesmanId === salesmanId
    );
  }, [transactions, salesmanId]);

  const grouped = useMemo(() => {
    return groupTransactionsByCustomer(filteredTransactions);
  }, [filteredTransactions]);

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
          Failed to load collections
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

        <Text className="text-2xl font-bold">{salesmanName}</Text>
      </View>

      <FlatList
        data={grouped}
        keyExtractor={(item) => item.customerId}
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
          const isUnread = unreadMap[item.customerId];

          return (
            <View
              className={`p-2 mb-3 rounded-xl shadow-sm overflow-hidden border ${
                isUnread
                  ? "bg-orange-50 border-orange-200"
                  : "bg-white border-transparent"
              }`}
            >
              {/* CUSTOMER HEADER */}
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: "screens/reports/unpaid/transactions",
                    params: {
                      customerId: item.customerId,
                      shopName: item.shopName,
                    },
                  })
                }
                className="flex-row items-center justify-between py-3 px-1"
              >
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{
                      uri:
                        item.customerImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.customerName
                        )}&background=random&size=64`,
                    }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View>
                    <Text className="text-xl font-bold capitalize">
                      {item.shopName}
                    </Text>

                    <Text className="text-sm text-gray-500">
                      {item.transactions.length} transaksi
                    </Text>
                  </View>
                </View>

                {/* CHEVRON */}
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

export default CustomersScreen;