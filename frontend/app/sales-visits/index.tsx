import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGetAllVisits } from "../hooks/visit/useGetAllVisits";

/* ================= HELPERS ================= */

const getResultStyle = (result?: string) => {
  switch (result) {
    case "new order":
      return "bg-green-300 text-green-700";
    case "follow-up":
      return "bg-yellow-300 text-yellow-700";
    case "shop closed":
      return "bg-red-300 text-red-700";
    default:
      return "bg-gray-200 text-gray-600";
  }
};

const formatTime = (dateString: string) => {
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

/* ================= SCREEN ================= */

const OwnerVisitScreen = () => {
  const router = useRouter();
  const { data: visits = [], isLoading, isError } = useGetAllVisits();

  /* ================= STATES ================= */

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

  /* ================= RENDER ================= */

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">
        Sales Visits Overview
      </Text>

      <FlatList
        data={visits}
        keyExtractor={(item: any) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => router.push(`/sales-visits/${item.id}`)}
            className="flex-row items-start p-3 border-b border-gray-300"
          >
            {/* NUMBER */}
            <Text className="w-6 font-bold">
              {index + 1}.
            </Text>

            {/* VISIT INFO */}
            <View className="flex-1">
              {/* Shop */}
              <Text className="font-semibold capitalize mb-1">
                {item.shopName}
              </Text>

              {/* Time */}
              <Text className="text-sm">
                In: {formatTime(item.checkInAt)}
              </Text>

              {item.checkOutAt && (
                <Text className="text-sm">
                  Out: {formatTime(item.checkOutAt)}
                </Text>
              )}

              {/* Notes */}
              {item.notes && (
                <Text
                  className="text-sm mt-2"
                  numberOfLines={2}
                >
                  Notes: {item.notes}
                </Text>
              )}
            </View>

            {/* RESULT BADGE */}
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
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
};

export default OwnerVisitScreen;