import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { Marker } from "react-native-maps";
import back from '../../assets/globalIcons/back.png'

import { useGetVisitById } from "../../hooks/visit/useGetVisitById";
import { useDeleteVisit } from "../../hooks/visit/useDeleteVisit";
import { formatTime } from "../../helper/formatTime";
import { formatDuration } from "../../helper/formatDuration";
import { useVisitDraftStore } from "../../stores/visitStore";
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";
import { Product } from "../../types/product";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { openMap } from "../../utils/openMap";
import { useVisitTransaction } from "../../hooks/useVisitTransaction";

const VisitDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);

  const [activeTab, setActiveTab] = useState<"basic" | "transaction">("basic");
  
  const { data: products } = useGetAllProduct();
  const { data: visit, isLoading, isError } = useGetVisitById(id);
  const { mutateAsync: deleteVisit, isPending } = useDeleteVisit();
  
  const draft = useVisitDraftStore((state) => id ? state.drafts[id] : undefined);
  const { mappedItems, subtotal, totalDiscount, finalAmount, transactionType } = useVisitTransaction(visit, draft);
  
  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["visit", id] });
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      `Delete Visit?`,
      "Are you sure you want to delete this visit? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteVisit({ id, imageId: visit?.checkInImageId });
              router.back();
            } catch (err: any) {
              const message = err?.response?.data?.message || "Failed to delete visit";
              Alert.alert("Delete Failed", message);
            }
          }
        },
      ]
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !visit) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading visit</Text>
      </View>
    );
  }

  const lat = visit.latitude;
  const lng = visit.longitude;

  const hasLocation = lat != null && lng != null;

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]} // optional: Android spinner color
            tintColor="#2563EB"  // optional: iOS spinner color
          />
        }
      >
      <View className="mb-6">
        <Pressable
          onPress={() => router.back()}
          className="absolute left-0 top-0 p-2 z-10"
        >
          <Image
            source={back}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </Pressable>
        
        <View className="items-center">
          <Image
            source={{
            uri:
              visit.checkInImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                visit.shopName
              )}&background=random&size=128`
            }}
            className="w-32 h-32 rounded-full mb-4"
          /> 
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row mb-4 border-b border-gray-200">
        <Pressable
          onPress={() => setActiveTab("basic")}
          className={`flex-1 py-3 ${
            activeTab === "basic" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "basic" ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Visit Info
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab("transaction")}
          className={`flex-1 py-3 ${
            activeTab === "transaction" ? "border-b-2 border-blue-500" : ""
          }`}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "transaction" ? "text-blue-500" : "text-gray-400"
            }`}
          >
            Visit Result
          </Text>
        </Pressable>
      </View>

      {activeTab === "basic" && (
        <>
        {/* Status */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Status</Text>
            <Text className="text-lg font-medium">
              {visit.status}
            </Text>
          </View>
        </View>

        {/* Result */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Result</Text>
            <Text className="text-lg font-medium capitalize">
              {visit.visitResult || draft?.result || "-"}
            </Text>
          </View>
        </View>

        {/* Check In */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Check In</Text>
            <Text className="text-lg font-medium">
              {formatTime(visit.checkInAt)}
            </Text>
          </View>
        </View>

        {/* Check Out */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Check Out</Text>
            <Text className="text-lg font-medium">
              {formatTime(visit.checkOutAt)}
            </Text>
          </View>
        </View>

        {/* Duration */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Duration</Text>
            <Text className="text-lg font-medium">
              {formatDuration(visit.duration)}
            </Text>
          </View>
        </View>

        {/* Shop Name */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Shop</Text>
            <Text className="text-lg font-medium">
              {visit.shopName}
            </Text>
          </View>
        </View>

        {/* Customer */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Customer</Text>
            <Text className="text-lg font-medium">
              {visit.customerName}
            </Text>
          </View>
        </View>

        {/* Address */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Address</Text>
            <Text className="text-lg font-medium">
              {visit.address}
            </Text>
          </View>
        </View>

        {/* Area */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Area</Text>
            <Text className="text-lg font-medium">
              {visit.areaName}
            </Text>
          </View>
        </View>
        
        {/* City */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">City</Text>
            <Text className="text-lg font-medium">
              {visit.city}
            </Text>
          </View>
        </View>

        {/* MAP */}
        {hasLocation && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm mb-2">Check-in location</Text>

            <Pressable onPress={() => openMap(lat, lng)}>
              <MapView
                style={{ width: "100%", height: 200, borderRadius: 12 }}
                initialRegion={{
                  latitude: lat,
                  longitude: lng,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: lat,
                    longitude: lng,
                  }}
                  title={visit.shopName}
                  description={visit.address}
                />
              </MapView>
            </Pressable>
          </View>
        )}
        </>
      )}   

      {activeTab === "transaction" && (
        <>
        {/* Transaction type */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Transaction type</Text>
            <Text className="text-lg font-medium">
              {transactionType || "-"}
            </Text>
          </View>
        </View>

        {/* Products */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm mb-3">Products</Text>

          {mappedItems.length ? (
            <View className="bg-gray-50 overflow-hidden">
              {/* Header */}
              <View className="flex-row justify-between px-3 py-2 bg-gray-100">
                <Text className="flex-1 text-xs font-semibold text-gray-500">
                  Product
                </Text>
                <Text className="w-12 text-xs font-semibold text-gray-500 text-right">
                  Qty
                </Text>
                <Text className="w-20 text-xs font-semibold text-gray-500 text-right">
                  Price
                </Text>
                <Text className="w-24 text-xs font-semibold text-gray-500 text-right">
                  Total
                </Text>
              </View>

              {/* Items */}
              {mappedItems.map((item: any, index: any) => {
                const product = products?.find((p: Product) => p.id === item.productId);

                return (
                  <View
                    key={index}
                    className="px-3 py-3 border-t border-gray-200"
                  >
                    <View className="flex-row justify-between">
                      <Text className="flex-1 text-sm font-medium text-gray-800">
                        {product?.name}
                      </Text>

                      <Text className="w-12 text-sm text-right text-gray-700">
                        {item.quantity}
                      </Text>

                      <View className="w-20 items-end">
                        <Text className="text-sm text-gray-700">
                          Rp {Number(item.price).toLocaleString()}
                        </Text>

                        <Text className="text-xs text-red-500">
                          - Rp {Number(item.discount).toLocaleString()}
                        </Text>
                      </View>

                      <Text className="w-24 text-sm text-right font-semibold text-gray-900">
                        Rp {Number(item.totalAfterDiscount).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                )}
              )}
            
              {/* Summary */}
              <View className="px-3 py-3 border-t border-gray-300 bg-white">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-500">Subtotal</Text>
                  <Text className="text-sm text-gray-700">
                    Rp {Number(subtotal).toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row justify-between mb-1">
                  <Text className="text-sm text-gray-500">Discount</Text>
                  <Text className="text-sm text-red-500">
                    - Rp {Number(totalDiscount).toLocaleString()}
                  </Text>
                </View>

                <View className="flex-row justify-between mt-2">
                  <Text className="text-base font-semibold text-gray-800">
                    Total
                  </Text>
                  <Text className="text-base font-bold text-gray-900">
                    Rp {Number(finalAmount).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          ) : (
            <Text className="text-gray-400 text-sm">No products</Text>
          )}
        </View>
        
        {/* Order by */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Order by</Text>
            <Text className="text-lg font-medium">
              {visit.orderBy || draft?.orderBy || "-"}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Notes</Text>
            <Text className="text-lg font-medium">
              {visit.notes || draft?.notes || "-"}
            </Text>
          </View>
        </View>
        </>
      )}

      {/* Button */}
        <View className="mt-6">
            <Pressable
              onPress={handleDelete}
              disabled={isPending}
              className="bg-red-600 rounded-lg p-4"
            >
            <Text className="text-white text-center font-semibold">
                Delete Visit
            </Text>
            </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VisitDetail;