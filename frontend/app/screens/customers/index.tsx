import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGetAllCustomer } from "../../hooks/customer/useGetAllCustomer";
import { Customer, GroupedCustomer } from "../../types/customer";
import { useState } from "react";

import back from '../../assets/globalIcons/back.png'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const CustomerScreen = () => {
  const router = useRouter();
  const { data: customers = [], isLoading, isError } = useGetAllCustomer();

  const groupedCustomers: GroupedCustomer[] = Object.values(
    (customers as Customer[]).reduce<Record<string, GroupedCustomer>>(
      (acc, customer) => {
        const key = customer.salesmanId

        if (!acc[key]) {
          acc[key] = {
            salesmanId: key,
            salesmanName: customer.salesmanName,
            salesmanImage: customer.salesmanImage,
            customers: [],
          };
        }

        acc[key].customers.push(customer);

        return acc;
      },
      {}
    )
  );

  const [expandedSalesmen, setExpandedSalesmen] = useState<Record<string, boolean>>({});

  const toggleExpand = (salesmanId: string) => {
    setExpandedSalesmen((prev) => ({
      ...prev,
      [salesmanId]: !prev[salesmanId],
    }));
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

        <Text className="text-2xl font-bold">List of customers</Text>
      </View>

      <FlatList
        data={groupedCustomers}
        keyExtractor={(item) => item.salesmanId}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isExpanded = expandedSalesmen[item.salesmanId] ?? false

          return (
            <View className="p-2 mb-3 bg-white rounded-xl shadow-sm overflow-hidden">
              {/* SALESMAN HEADER - COLLAPSIBLE */}
              <Pressable
                onPress={() => toggleExpand(item.salesmanId)}
                className="flex-row items-center justify-between py-3 px-1 active:opacity-70"
              >
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{
                      uri:
                        item.salesmanImage ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          item.salesmanName
                        )}&background=random&size=64`,
                    }}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <View>
                    <Text className="text-xl font-bold capitalize">
                      {item.salesmanName}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {item.customers.length} customer{item.customers.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>

                {/* Chevron Icon */}
                <View className="ml-2">
                  <MaterialIcons 
                    name={isExpanded ? "keyboard-arrow-down" : "keyboard-arrow-right"} 
                    size={24} 
                    color="black" 
                  />
                </View>
              </Pressable>

              {/* CUSTOMER LIST - Only shown when expanded */}
              {isExpanded && (
                <View className="pl-1">
                  {item.customers.map((customer, index) => (
                    <Pressable
                      key={customer.id}
                      onPress={() => router.push(`screens/customers/${customer.id}`)}
                      className="flex-row items-start py-4 border-b border-gray-200 last:border-b-0"
                    >
                      {/* NUMBER */}
                      <Text className="w-6 font-bold text-black mt-0.5">
                        {index + 1}.
                      </Text>

                      {/* CUSTOMER INFO */}
                      <View className="flex-1 pr-2 gap-1">
                        <Text className="font-semibold capitalize">
                          {customer.shopName}
                        </Text>
                        <Text className="text-gray-700 text-sm">
                          {customer.address}
                        </Text>
                      </View>

                      {/* EDIT BUTTON */}
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push(`screens/customers/edit/${customer.id}`);
                        }}
                        className="p-2 rounded-full self-start mt-1"
                      >
                        <FontAwesome6 name="edit" size={16} color="black" />
                      </Pressable>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />

      {/* CREATE BUTTON */}
      <Pressable
        onPress={() => router.push("screens/customers/create")}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Customer
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default CustomerScreen;