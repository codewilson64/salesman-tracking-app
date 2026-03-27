import {
  View,
  Text,
  ActivityIndicator,
  Image,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetVisitById } from "../hooks/visit/useGetVisitById";


const formatTime = (dateString?: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const VisitDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: visit, isLoading, isError } = useGetVisitById(id);
//   const { mutateAsync: deleteVisit, isPending } = useDeleteVisit();

//   const handleDelete = () => {
//     Alert.alert(
//       `Delete Visit?`,
//       "Are you sure you want to delete this visit? This action cannot be undone.",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await deleteVisit(id);
//               router.back();
//             } catch (err) {
//               console.error(err);
//             }
//           },
//         },
//       ]
//     );
//   };

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

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
      <View className="items-center mb-6">
        <Image
          source={{
            uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
              visit.shopName || "Visit"
            )}&size=128`,
          }}
          className="w-32 h-32 rounded-full mb-4"
        />
      </View>

      {/* Info */}
      <View className="mt-4">
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

        {/* Result */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Result</Text>
            <Text className="text-lg font-medium capitalize">
              {visit.visitResult || "-"}
            </Text>
          </View>
        </View>

        {/* Notes */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Notes</Text>
            <Text className="text-lg font-medium">
              {visit.notes || "-"}
            </Text>
          </View>
        </View>
      </View>

        {/* Button */}
        <View className="mt-6">
            <Pressable
            //   onPress={handleDelete}
            //   disabled={isPending}
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