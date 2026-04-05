import { View, Text, ActivityIndicator, Pressable, Alert, Image, Platform, Linking, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetCustomerById } from "../hooks/customer/useGetCustomerById";
import { useDeleteCustomer } from "../hooks/customer/useDeleteCustomer";
import MapView, { Marker } from "react-native-maps";
import back from '../assets/globalIcons/back.png'

const CustomerDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: customer, isLoading, isError } = useGetCustomerById(id);
  const { mutateAsync: deleteCustomer, isPending } = useDeleteCustomer();

  const handleDelete = () => {
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
  
    const openMap = () => {
      if (!hasLocation) return;
  
      const url = Platform.select({
        ios: `maps:0,0?q=${lat},${lng}`,
        android: `geo:0,0?q=${lat},${lng}`,
        default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      });
  
      Linking.openURL(url!);
    };

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
      {/* INFO */}
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
              uri: customer.customerImage
                ? customer.customerImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    customer.shopName
                  )}&background=random&size=128`,
            }}
            className="w-32 h-32 rounded-full mb-4"
          /> 
        </View>
      </View>

      <View>
        {/* SALESMAN */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Salesman</Text>
          <Text className="text-lg font-medium capitalize">
            {customer.salesmanName || "-"}
          </Text>
        </View>

        {/* AREA */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Area</Text>
          <Text className="text-lg font-medium capitalize">
            {customer.areaName || "-"}
          </Text>
        </View>

        {/* CUSTOMER NAME */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Customer Name</Text>
          <Text className="text-lg font-medium capitalize">
            {customer.customerName}
          </Text>
        </View>

        {/* SHOP NAME */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Shop Name</Text>
          <Text className="text-lg font-medium capitalize">
            {customer.shopName}
          </Text>
        </View>

        {/* PHONE */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Phone</Text>
          <Text className="text-lg font-medium">
            {customer.phone}
          </Text>
        </View>

        {/* ADDRESS */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Address</Text>
          <Text className="text-lg font-medium">
            {customer.address || "-"}
          </Text>
        </View>

        {/* DESCRIPTION */}
        <View className="p-4 border-b border-gray-200">
          <Text className="text-gray-500 text-sm">Description</Text>
          <Text className="text-lg font-medium">
            {customer.description || "-"}
          </Text>
        </View>

        {/* MAP */}
        {hasLocation && (
          <View className="p-4 border-b border-gray-200">
            <Text className="text-gray-500 text-sm mb-2">Location</Text>

            <Pressable onPress={openMap}>
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
                  title={customer.shopName}
                  description={customer.address}
                />
              </MapView>
            </Pressable>
          </View>
        )}
      </View>

        {/* DELETE BUTTON */}
        <View className="flex-1 justify-end mt-6">
          <Pressable
            onPress={handleDelete}
            disabled={isPending}
            className="bg-red-600 rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              Delete Customer
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CustomerDetail;