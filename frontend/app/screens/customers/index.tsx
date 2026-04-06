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
import back from '../../assets/globalIcons/back.png'
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useGetAllCustomer } from "../../hooks/customer/useGetAllCustomer";
import { Customer, GroupedCustomer } from "../../types/customer";

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
    <SafeAreaView className="flex-1 p-4">
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
        keyExtractor={(item) => item.salesmanName}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="p-2 mb-6">
            {/* SALESMAN HEADER */}
            <View className="flex-row items-center mb-2">
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
              <Text className="text-xl font-bold capitalize">
                {item.salesmanName}
              </Text>
            </View>

            {/* CUSTOMER LIST */}
            {item.customers.map((customer, index) => (
              <Pressable
                key={customer.id}
                onPress={() => router.push(`screens/customers/${customer.id}`)}
                className="flex-row items-start py-4 border-b border-gray-300"
              >
                {/* NUMBER */}
                <Text className="w-6 font-bold">
                  {index + 1}.
                </Text>

                {/* CUSTOMER INFO */}
                <View className="flex-1 gap-1">
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
                  className="bg-gray-200 p-2 rounded-full"
                >
                  <FontAwesome6 name="edit" size={16} color="black" />
                </Pressable>
              </Pressable>
            ))}
          </View>
        )}
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