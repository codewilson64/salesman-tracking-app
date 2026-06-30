import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import back from "../../assets/globalIcons/back.png";
import { useGetVisitById } from "../../hooks/visit/useGetVisitById";
import { formatTime } from "../../helper/formatTime";
import { formatDuration } from "../../helper/formatDuration";

import { openMap } from "../../utils/openMap";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { UpdateTitipanList } from "../../components/visit/UpdateTitipanList";
import { VisitProductList } from "../../components/visit/ProductList";
import { useGetAllProduct } from "../../hooks/product/useGetAllProduct";

const SalesVisitDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const queryClient = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"info" | "result">("info");

  const { data: products } = useGetAllProduct();

  const { data: visit, isLoading, isError } = useGetVisitById(id);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ["visit", id] });
    setRefreshing(false);
  };

  const visitResult = visit?.visitResult;

  const isTitip = visitResult === "Titip Baru";
  const isUpdateTitipan = visitResult === "Update Titipan";
  const isOrder = visitResult === "Order Baru";

  const transaction = visit?.transactions?.[0];

  const transactionItems = transaction?.items ?? [];
  const consignmentItems = visit?.consignmentItems ?? [];

  const productItems = isTitip ? consignmentItems : transactionItems;

  const consignmentTotal = consignmentItems.reduce(
    (sum: number, item: any) => sum + Number(item.totalAmount || 0),
    0
  );

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
        <View className="mb-6 relative">
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
              onPress={() => setActiveTab("info")}
              className={`flex-1 py-3 ${
                activeTab === "info" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "info" ? "text-blue-500" : "text-gray-400"
                }`}
              >
                Informasi Kunjungan
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveTab("result")}
              className={`flex-1 py-3 ${
                activeTab === "result" ? "border-b-2 border-blue-500" : ""
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "result" ? "text-blue-500" : "text-gray-400"
                }`}
              >
                Hasil Kunjungan
              </Text>
            </Pressable>
          </View>

          {activeTab === "info" && (
            <>
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Status</Text>
                  <Text className="text-lg font-medium">{visit.status}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Check In</Text>
                  <Text className="text-lg font-medium">
                    {formatTime(visit.checkInAt)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Check Out</Text>
                  <Text className="text-lg font-medium">
                    {formatTime(visit.checkOutAt)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Durasi</Text>
                  <Text className="text-lg font-medium">
                    {formatDuration(visit.duration)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">
                    Jarak Check In 
                  </Text>
                  <Text className="text-lg font-medium">
                    {visit.checkInDistanceMeters != null
                      ? `${visit.checkInDistanceMeters} m`
                      : "-"}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">
                    Jarak Check Out
                  </Text>
                  <Text className="text-lg font-medium">
                    {visit.checkOutDistanceMeters != null
                      ? `${visit.checkOutDistanceMeters} m`
                      : "-"}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Nama Toko</Text>
                  <Text className="text-lg font-medium">{visit.shopName}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Nama Pelanggan</Text>
                  <Text className="text-lg font-medium">
                    {visit.customerName}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Alamat</Text>
                  <Text className="text-lg font-medium">{visit.address}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Kawasan / Area</Text>
                  <Text className="text-lg font-medium">{visit.areaName}</Text>
                </View>
              </View>

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Kota</Text>
                  <Text className="text-lg font-medium">{visit.city}</Text>
                </View>
              </View>

              {hasLocation && (
                <View className="pt-4 pb-4 rounded-lg">
                  <Pressable
                    onPress={() => openMap(lat, lng)}
                    className="bg-green-600 rounded-lg p-3"
                  >
                    <Text className="text-white text-center">
                      Lihat Titik Lokasi
                    </Text>
                  </Pressable>
                </View>
              )}
            </>
          )}

          {activeTab === "result" && (
            <>
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Hasil</Text>
                  <Text className="text-lg font-medium capitalize">
                    {visit.visitResult || "-"}
                  </Text>
                </View>
              </View>
              
              {isOrder && (
                <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                  <View>
                    <Text className="text-gray-500 text-sm">
                      Tipe Transaksi
                    </Text>
                    <Text className="text-lg font-medium capitalize">
                      {transaction?.transactionType || "-"}
                    </Text>
                  </View>
                </View>
              )}

              {isUpdateTitipan ? (
                <UpdateTitipanList 
                  items={consignmentItems} 
                  products={products}
                />
              ) : (
                <VisitProductList
                  items={productItems}
                  products={products}
                  isOrder={isOrder}
                  isTitip={isTitip}
                  subtotal={
                    isTitip
                      ? consignmentTotal
                      : Number(transaction?.totalAmount || 0)
                  }
                  totalDiscount={Number(transaction?.totalDiscount || 0)}
                  finalAmount={
                    isTitip
                      ? consignmentTotal
                      : Number(transaction?.finalAmount || 0)
                  }
                />
              )}

              {!isUpdateTitipan && (
                <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                  <View>
                    <Text className="text-gray-500 text-sm">
                      {isTitip ? "Dititip Kepada" : "Di Order Oleh"}
                    </Text>
                    <Text className="text-lg font-medium">
                      {visit.orderBy || "-"}
                    </Text>
                  </View>
                </View>
              )}

              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <View>
                  <Text className="text-gray-500 text-sm">Keterangan Tambahan</Text>
                  <Text className="text-lg font-medium">
                    {visit.notes || "-"}
                  </Text>
                </View>
              </View>

              {isOrder && transaction && (
                <>
                  <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                    <View>
                      <Text className="text-gray-500 text-sm">
                        Status Pembayaran
                      </Text>
                      <Text
                        className={`text-lg font-medium capitalize ${
                          transaction.paymentStatus === "Lunas"
                            ? "text-green-600"
                            : transaction.paymentStatus === "Bayar Sebagian"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.paymentStatus || "-"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                    <View>
                      <Text className="text-gray-500 text-sm">
                        Metode Pembayaran
                      </Text>
                      <Text className="text-lg font-medium capitalize">
                        {transaction.paymentType || "-"}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                    <View>
                      <Text className="text-gray-500 text-sm">
                       Jumlah Pembayaran
                      </Text>
                      <Text className="text-lg font-medium">
                        Rp {Number(transaction.paidAmount || 0).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SalesVisitDetail;