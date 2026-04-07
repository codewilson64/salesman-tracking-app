import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import back from '../../assets/globalIcons/back.png'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { useGetAllVisits } from "../../hooks/visit/useGetAllVisits";
import { formatTime } from "../../helper/formatTime";
import { getResultStyle } from "../../helper/resultStyle";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCheckoutVisit } from "../../hooks/visit/useCheckoutVisit";
import { useVisitDraftStore } from "../../stores/visitStore";
import { Visit } from "../../types/visit";

const VisitScreen = () => {
  const router = useRouter();
  const { data: visits = [], isLoading, isError } = useGetAllVisits({});
  const { mutateAsync, isPending } = useCheckoutVisit();

  const { result, transactionType, notes, products, reset } = useVisitDraftStore();

  const hasActiveVisit = visits?.some((v: Visit) => v.checkOutAt === null);

  const handleCheckout = async () => {
    Alert.alert(
      "Confirm Checkout",
      "Are you sure you want to checkout this visit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, Checkout",
          style: "destructive",   // Makes the button red on iOS
          onPress: async () => {
            try {
              const mappedProducts = products.map((p) => ({
                productId: p.productId,
                quantity: Number(p.quantity),
                price: Number(p.price),
                discount: Number(p.discount || 0),
              }));

              await mutateAsync({
                result: result as "new order" | "follow-up" | "shop closed",
                transactionType: transactionType as "cash" | "credit",
                notes,
                products: mappedProducts,
              });

              reset();

              Alert.alert("Success", "Visit checked out successfully");
            } catch (err) {
              Alert.alert("Error", "Checkout failed");
            }
          },
        },
      ]
    );
  };

  const handleCreateVisit = () => {
    if (hasActiveVisit) {
      Alert.alert(
        "Finish Visit First",
        "Please checkout your current visit before adding a new one."
      );
      return;
    }

    router.push("screens/visits/create");
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

            {item.visitResult && (
              <View
                className={`mt-1 self-start px-2 py-1 rounded ${getResultStyle(
                  item.visitResult
                )}`}
              >
                <Text className="text-xs font-semibold capitalize">
                  {item.visitResult}
                </Text>
              </View>
            )}

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
                {result && (
                  <Pressable
                    onPress={handleCheckout}
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

      {/* CREATE BUTTON */}
      <Pressable
        onPress={handleCreateVisit}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Visit
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default VisitScreen;