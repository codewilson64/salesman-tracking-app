import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";

import { useGetAllVisits } from "../../hooks/visit/useGetAllVisits";
import { formatTime } from "../../helper/formatTime";
import { getResultStyle } from "../../helper/resultStyle";

import { useCheckoutVisit } from "../../hooks/visit/useCheckoutVisit";
import { useVisitDraftStore } from "../../stores/visitStore";
import { useMemo, useState } from "react";
import { getStartEndOfDay } from "../../utils/date";
import { useQueryClient } from "@tanstack/react-query";

import back from '../../assets/globalIcons/back.png'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const VisitList = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { mutateAsync, isPending } = useCheckoutVisit();

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["visits"] });
    setRefreshing(false);
  };

  const { startDate, endDate } = useMemo(() => {
    return getStartEndOfDay(date as string);
  }, [date]);

  const { data: visits = [], isLoading, isError } = useGetAllVisits({
    startDate,
    endDate,
  });

  const drafts = useVisitDraftStore((state) => state.drafts);
  const resetDraft = useVisitDraftStore((state) => state.resetDraft);
  
  const handleCheckout = async (visitIdFromItem: string) => {
    const draft = drafts[visitIdFromItem];

    if (!draft) {
      Alert.alert("Error", "No draft found for this visit");
      return;
    }

    const { result, transactionType, orderBy, notes, products, paidAmount, paymentType } = draft;

    Alert.alert(
      "Confirm Checkout",
      "Are you sure you want to checkout this visit?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Checkout",
          style: "destructive",
          onPress: async () => {
            try {
              const mappedProducts = products.map((p) => ({
                productId: p.productId,
                quantity: Number(p.quantity),
                price: Number(p.price),
                discount: Number(p.discount || 0),
              }));

              await mutateAsync({
                id: visitIdFromItem,
                result: result as "new order" | "follow-up" | "shop closed",
                transactionType: transactionType as "cash" | "credit",
                products: mappedProducts,
                orderBy,
                paymentType,
                paidAmount,
                notes,
              });

              resetDraft(visitIdFromItem);

              Alert.alert("Success", "Visit checked out successfully");
            } catch (err) {
              Alert.alert("Error", "Checkout failed");
            }
          },
        },
      ]
    );
  };

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
    <SafeAreaView className="flex-1 p-4 bg-gray-100">
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

        <Text className="text-2xl font-bold">Your visit</Text>
      </View>

      <FlatList
        data={visits}
        keyExtractor={(item) => item.id}
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
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`screens/visits/${item.id}`)}
            className="flex-row items-start p-3 border-b border-gray-300"
          >
            {/* NUMBER */}
            <Text className="w-6 font-bold">
              {index + 1}.
            </Text>

            {/* VISIT INFO */}
            <View className="flex-1">
              <Text className="font-semibold capitalize mb-2">
                {item.shopName}
              </Text>

              <Text className="text-sm">
                In: {formatTime(item.checkInAt)}
              </Text>

              {item.checkOutAt && (
                <Text className="text-sm">
                  Out: {formatTime(item.checkOutAt)}
                </Text>
              )}

              {item.notes && (
                <Text
                  className="text-sm mt-2"
                  numberOfLines={2}
                >
                  Notes: {item.notes}
                </Text>
              )}
            </View>

            {item.visitResult && (() => {
              const style = getResultStyle(item.visitResult);

              return (
                <View className="flex-col gap-1">
                  <View
                    className={`mt-1 self-end px-2 py-1 rounded ${style.bg}`}
                  >
                    <Text
                      className={`text-xs font-semibold capitalize ${style.text}`}
                    >
                      {item.visitResult}
                    </Text>
                  </View>
{/* 
                  <Text className="text-lg capitalize">
                    {item.checkOutAt &&
                      item.visitResult === "new order" &&
                      `(${item.approvalStatus || "Pending"})`}
                  </Text> */}
                </View>
              );
            })()}

            {!item.checkOutAt && (
              <View className="absolute bottom-3 right-3 flex-row items-center">               
                {/* EDIT */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push(`/screens/visits/edit/${item.id}`);
                  }}
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <FontAwesome6 name="edit" size={16} color="black" />
                </Pressable>

                {/* CHECKOUT */}
                {drafts[item.id]?.result && (
                  <Pressable
                    onPress={() => handleCheckout(item.id)}
                    disabled={isPending}
                    className="bg-gray-200 p-2 rounded-full ml-3"
                  >
                    <MaterialCommunityIcons name="logout" size={16} color="black" />
                  </Pressable>
                )}
              </View>
            )}
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default VisitList;