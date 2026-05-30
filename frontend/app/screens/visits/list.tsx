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
import { useCheckoutVisit } from "../../hooks/visit/useCheckoutVisit";
import { useVisitDraftStore } from "../../stores/visitStore";
import { useMemo, useState } from "react";
import { getStartEndOfDay } from "../../utils/date";
import { useQueryClient } from "@tanstack/react-query";

import back from '../../assets/globalIcons/back.png'

import { useCurrentLocation } from "../../hooks/location/useCurrentLocation";
import { VisitItem } from "./visitItem";

const VisitList = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const [isCalculatingCheckout, setIsCalculatingCheckout] = useState(false);

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const { mutateAsync, isPending } = useCheckoutVisit();

  const { getCurrentLocation } = useCurrentLocation();

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
              const location = await getCurrentLocation();

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
                checkOutLatitude: location.latitude,
                checkOutLongitude: location.longitude,
                checkOutGpsAccuracy: location.gpsAccuracy,
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
          <VisitItem
            item={item}
            index={index}
            drafts={drafts}
            isPending={isPending}
            handleCheckout={handleCheckout}
            setIsCalculatingCheckout={setIsCalculatingCheckout}
          />
        )}
      />

      {isCalculatingCheckout && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-50">
          <ActivityIndicator size="large" color="white" />

          <Text className="text-white text-lg font-semibold mt-4">
            Checking out...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default VisitList;