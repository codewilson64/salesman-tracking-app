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
import { useGetOutstandingTransactions } from "../../../hooks/transaction/useGetOutstandingTransactions";
import { useExpand } from "../../../hooks/useExpand";
import { groupTransactionsByCustomer } from "../../../utils/groupBy/customers";
import { formatTime } from "../../../helper/formatTime";

import back from '../../../assets/globalIcons/back.png'
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const CollectionsScreen = () => {
  const router = useRouter();

  const { data: transactions = [], isLoading, isError } = useGetOutstandingTransactions({});

  const { expanded, toggle } = useExpand();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
      await queryClient.invalidateQueries({ queryKey: ["transactions", "outstanding"] });
    setRefreshing(false);
  };

  const grouped = useMemo(() => {
    return groupTransactionsByCustomer(transactions);
  }, [transactions]);

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

        <Text className="text-2xl font-bold">Tagihan</Text>
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
          const isExpanded = expanded[item.customerId] ?? false;

          return (
            <View className="p-2 mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
              {/* CUSTOMER HEADER */}
              <Pressable
                onPress={() => toggle(item.customerId)}
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
                      {item.transactions.length} transaction
                      {item.transactions.length !== 1 ? "s" : ""}
                    </Text>
                  </View>
                </View>

                {/* CHEVRON */}
                <MaterialIcons
                  name={isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"}
                  size={24}
                  color="black"
                />
              </Pressable>

              {/* TRANSACTION LIST */}
              {isExpanded && (
                <View className="pl-1">
                  {item.transactions.map((t, index) => (
                    <View
                      key={t.id}
                      className="flex-row items-start py-4 border-b border-gray-200 last:border-b-0"
                    >
                      {/* NUMBER */}
                      <Text className="w-6 font-bold">
                        {index + 1}.
                      </Text>

                      {/* INFO */}
                      <View className="flex-1">
                        <Text className="text-sm">
                          {formatTime(t.checkInAt)}
                        </Text>

                        <Text className="font-semibold">
                          Rp {Number(t.finalAmount).toLocaleString()}
                        </Text>

                        {/* <Text
                          className={`text-xs ${
                            t.paymentStatus === "partial"
                              ? "text-yellow-600"
                              : "text-red-500"
                          }`}
                        >
                          {t.paymentStatus}
                        </Text> */}
                      </View>
                      {/* EDIT BUTTON */}
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push(`screens/reports/unpaid/edit/${t.id}`);
                        }}
                        className="p-2 self-start"
                      >
                        <FontAwesome6 name="edit" size={16} color="black" />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
};

export default CollectionsScreen;