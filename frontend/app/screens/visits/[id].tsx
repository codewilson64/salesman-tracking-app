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
import back from "../../assets/globalIcons/back.png";

import { useGetVisitById } from "../../hooks/visit/useGetVisitById";
import { useDeleteVisit } from "../../hooks/visit/useDeleteVisit";
import { formatTime } from "../../helper/formatTime";
import { formatDuration } from "../../helper/formatDuration";
import { useVisitDraftStore } from "../../stores/visitStore";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { openMap } from "../../utils/openMap";
import { useVisitTransaction } from "../../hooks/useVisitTransaction";
import { UpdateTitipanList } from "../../components/visit/UpdateTitipanList";
import { VisitProductList } from "../../components/visit/ProductList";
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";

const VisitDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "transaction">("basic");

  const { data: products } = useGetAllProduct();
  const { data: visit, isLoading, isError } = useGetVisitById(id);
  const { mutateAsync: deleteVisit, isPending } = useDeleteVisit();

  const draft = useVisitDraftStore((state) =>
    id ? state.drafts[id] : undefined
  );

  const visitResult = visit?.visitResult || draft?.result;

  const isTitip = visitResult === "Titip Baru";
  const isUpdateTitipan = visitResult === "Update Titipan";
  const isOrder = visitResult === "Order Baru";

  const consignmentItems = draft?.consignmentItems || visit?.consignmentItems || [];

  const {
    mappedItems,
    subtotal,
    totalDiscount,
    finalAmount,
    transactionType,
    paymentStatus,
    paidAmount,
    paymentType,
  } = useVisitTransaction(visit, draft, products);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["visit", id] });
    setRefreshing(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Visit?",
      "Are you sure you want to delete this visit? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteVisit({
                id,
                imageId: visit?.checkInImageId,
              });
              router.back();
            } catch (err: any) {
              const message =
                err?.response?.data?.message || "Failed to delete visit";
              Alert.alert("Delete Failed", message);
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
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }
      >
        <View className="mb-6">
          <Image
            source={{
              uri:
                visit.checkInImage ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  visit.shopName
                )}&background=random&size=128`,
            }}
            className="w-full h-96"
            resizeMode="cover"
          />

          <Pressable
            onPress={() => router.back()}
            className="absolute left-4 top-4 p-2 z-10 bg-white/80 rounded-full"
          >
            <Image source={back} className="w-6 h-6" resizeMode="contain" />
          </Pressable>
        </View>

        <View className="px-4">
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
                Informasi Kunjungan
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
                  activeTab === "transaction"
                    ? "text-blue-500"
                    : "text-gray-400"
                }`}
              >
                Hasil Kunjungan
              </Text>
            </Pressable>
          </View>

          {activeTab === "basic" && (
            <>
              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Status</Text>
                <Text className="text-lg font-medium">{visit.status}</Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Check In</Text>
                <Text className="text-lg font-medium">
                  {formatTime(visit.checkInAt)}
                </Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Check Out</Text>
                <Text className="text-lg font-medium">
                  {formatTime(visit.checkOutAt)}
                </Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Durasi</Text>
                <Text className="text-lg font-medium">
                  {formatDuration(visit.duration)}
                </Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Jarak Check In</Text>
                <Text className="text-lg font-medium">
                  {visit.checkInDistanceMeters != null
                    ? `${visit.checkInDistanceMeters} m`
                    : "-"}
                </Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Jarak Check Out</Text>
                <Text className="text-lg font-medium">
                  {visit.checkOutDistanceMeters != null
                    ? `${visit.checkOutDistanceMeters} m`
                    : "-"}
                </Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Toko</Text>
                <Text className="text-lg font-medium">{visit.shopName}</Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Nama Pelanggan</Text>
                <Text className="text-lg font-medium">
                  {visit.customerName}
                </Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Alamat</Text>
                <Text className="text-lg font-medium">{visit.address}</Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Kawasan / Area</Text>
                <Text className="text-lg font-medium">{visit.areaName}</Text>
              </View>

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Kota</Text>
                <Text className="text-lg font-medium">{visit.city}</Text>
              </View>

              {hasLocation && (
                <View className="rounded-lg pt-4 pb-4">
                  <Pressable
                    onPress={() => openMap(lat, lng)}
                    className="bg-green-600 rounded-lg p-3"
                  >
                    <Text className="text-white text-center">Lihat Titik Lokasi</Text>
                  </Pressable>
                </View>
              )}
            </>
          )}

          {activeTab === "transaction" && (
            <>
              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Hasil</Text>
                <Text className="text-lg font-medium capitalize">
                  {visitResult || "-"}
                </Text>
              </View>

              {isOrder && (
                <View className="p-4 border-b border-gray-200">
                  <Text className="text-gray-500 text-sm">
                    Tipe Transaksi
                  </Text>
                  <Text className="text-lg font-medium capitalize">
                    {transactionType || "-"}
                  </Text>
                </View>
              )}

              {isUpdateTitipan ? (
                <UpdateTitipanList
                  items={consignmentItems}
                  products={products}
                />
              ) : (
                <VisitProductList
                  items={mappedItems}
                  products={products}
                  isOrder={isOrder}
                  isTitip={isTitip}
                  subtotal={subtotal}
                  totalDiscount={totalDiscount}
                  finalAmount={finalAmount}
                />
              )}

              {isOrder && (
                <>
                  <View className="p-4 border-b border-gray-200">
                    <Text className="text-gray-500 text-sm">
                      Status Pembayaran
                    </Text>
                    <Text
                      className={`text-lg font-medium capitalize ${
                        paymentStatus === "Lunas"
                          ? "text-green-600"
                          : paymentStatus === "Bayar Sebagian"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {paymentStatus || "-"}
                    </Text>
                  </View>

                  <View className="p-4 border-b border-gray-200">
                    <Text className="text-gray-500 text-sm">Jumlah Pembayaran</Text>
                    <Text className="text-lg font-medium">
                      Rp {Number(paidAmount).toLocaleString()}
                    </Text>
                  </View>

                  <View className="p-4 border-b border-gray-200">
                    <Text className="text-gray-500 text-sm">Metode Pembayaran</Text>
                    <Text className="text-lg font-medium capitalize">
                      {paymentType || "-"}
                    </Text>
                  </View>
                </>
              )}

              {!isUpdateTitipan && (
                <View className="p-4 border-b border-gray-200">
                  <Text className="text-gray-500 text-sm">
                    {isTitip ? "Dititip kepada" : "Di Order Oleh"}
                  </Text>
                  <Text className="text-lg font-medium">
                    {visit.orderBy || draft?.orderBy || "-"}
                  </Text>
                </View>
              )}

              <View className="p-4 border-b border-gray-200">
                <Text className="text-gray-500 text-sm">Keterangan Tambahan</Text>
                <Text className="text-lg font-medium">
                  {visit.notes || draft?.notes || "-"}
                </Text>
              </View>
            </>
          )}

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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VisitDetail;