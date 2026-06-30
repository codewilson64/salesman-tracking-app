import { View, Text, ActivityIndicator, Pressable, Alert, Image, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGetCustomerById } from "../../hooks/customer/useGetCustomerById";
import { useDeleteCustomer } from "../../hooks/customer/useDeleteCustomer";
import { openMap } from "../../utils/openMap";
import { useState } from "react";

import back from '../../assets/globalIcons/back.png'
import dots from "../../assets/globalIcons/dots.png";
import { useGetCustomerConsignmentStocks } from "../../hooks/consignment/useGetCustomerConsignmentStocks";
import { ActiveConsignmentStockSection } from "../../components/ActiveConsignmentStock";

const CustomerDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);

  const { data: customer, isLoading, isError } = useGetCustomerById(id);
  const { mutateAsync: deleteCustomer, isPending } = useDeleteCustomer();
  const { data: consignmentStocks = [] } = useGetCustomerConsignmentStocks(id);

  const handleDelete = () => {
    setShowMenu(false);

    Alert.alert(
      `Delete ${customer?.shopName}?`,
      "Are you sure you want to delete this customer? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCustomer({ id, imageId:customer?.customerImageId });
              router.back();
            } catch (err: any) {
              const message =
                err?.response?.data?.message || "Failed to delete customer";
              Alert.alert("Delete Failed", message);
            }
          },
        },
      ]
    );
  };

  const handleEdit = () => {
    setShowMenu(false);

    router.push({
      pathname: "/screens/customers/edit/[id]",
      params: { id },
    });
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError || !customer) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading customer</Text>
      </View>
    );
  }

  const lat = customer.latitude;
  const lng = customer.longitude;
  
  const hasLocation = lat != null && lng != null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6 relative">
          <Image
            source={{
              uri: customer.customerImage
                ? customer.customerImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    customer.shopName
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

          {/* Dots */}
          <View className="absolute right-4 top-4 z-20">
            <Pressable
              onPress={() => setShowMenu(!showMenu)}
              className="p-2 bg-white/80 rounded-full"
            >
              <Image source={dots} className="w-6 h-6" resizeMode="contain" />
            </Pressable>

            {showMenu && (
              <View className="absolute top-12 right-0 bg-white rounded-xl border border-gray-200 shadow w-36 overflow-hidden">
                <Pressable
                  onPress={handleEdit}
                  className="px-4 py-3 border-b border-gray-100"
                >
                  <Text>Edit</Text>
                </Pressable>

                <Pressable
                  onPress={handleDelete}
                  disabled={isPending}
                  className="px-4 py-3"
                >
                  <Text className="text-red-600">
                    {isPending ? "Deleting..." : "Delete"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        {/* CONTENT WITH LEFT/RIGHT PADDING */}
        <View className="px-4">
          {/* SALESMAN */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">Salesman</Text>
            <Text className="text-lg font-medium capitalize">
              {customer.salesmanName || "-"}
            </Text>
          </View>

          {/* AREA */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">Kawasan / Area</Text>
            <Text className="text-lg font-medium capitalize">
              {customer.areaName || "-"}
            </Text>
          </View>

          {/* CUSTOMER NAME */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">Nama pelanggan</Text>
            <Text className="text-lg font-medium capitalize">
              {customer.customerName}
            </Text>
          </View>

          {/* SHOP NAME */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">Nama toko</Text>
            <Text className="text-lg font-medium capitalize">
              {customer.shopName}
            </Text>
          </View>

          {/* PHONE */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">No HP</Text>
            <Text className="text-lg font-medium">{customer.phone}</Text>
          </View>

          {/* ADDRESS */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">Alamat</Text>
            <Text className="text-lg font-medium">
              {customer.address || "-"}
            </Text>
          </View>

          {/* DESCRIPTION */}
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm">Deskripsi</Text>
            <Text className="text-lg font-medium">
              {customer.description || "-"}
            </Text>
          </View>

          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm mb-3">Stok Titipan Aktif</Text>

            <ActiveConsignmentStockSection stocks={consignmentStocks} />
          </View>

          {/* MAP */}
          {hasLocation && (
            <View className="pt-4 pb-4 rounded-lg">
              <Pressable
                onPress={() => openMap(lat, lng)}
                className="bg-green-600 rounded-lg p-3"
              >
                <Text className="text-white text-center">Lihat Titik Lokasi</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerDetail;