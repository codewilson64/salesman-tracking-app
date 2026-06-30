import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";

import back from "../../assets/globalIcons/back.png";

import { useGetAllCustomer } from "../../hooks/customer/useGetAllCustomer";
import { Customer } from "../../types/customer";

const CustomersListScreen = () => {
  const router = useRouter();

  const { salesmanId, salesmanName } = useLocalSearchParams<{
    salesmanId: string;
    salesmanName: string;
  }>();

  const { data: customers = [], isLoading, isError } = useGetAllCustomer();

  const salesmanCustomers = useMemo(() => {
    return (customers as Customer[]).filter(
      (customer) => customer.salesmanId === salesmanId
    );
  }, [customers, salesmanId]);

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
          Error occurred while fetching customers.
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

        <View>
          <Text className="text-2xl font-bold capitalize">
            {salesmanName}
          </Text>
        </View>
      </View>

      <FlatList
        data={salesmanCustomers}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`screens/customers/${item.id}`)}
            className="bg-white rounded-xl p-4 mb-3 shadow-sm"
          >
            <View className="flex-row">
              <Text className="w-6 font-bold">
                {index + 1}.
              </Text>

              <Image
                source={{
                  uri: item.customerImage
                    ? item.customerImage
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        item.customerName || "Customer"
                      )}&background=random&size=128`,
                }}
                className="w-20 h-20 rounded-lg mr-3 bg-gray-200"
                resizeMode="cover"
              />

              <View className="flex-1 gap-1">
                <Text className="font-semibold capitalize">
                  {item.shopName}
                </Text>

                <Text className="text-gray-600 text-sm">
                  {item.address}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default CustomersListScreen;