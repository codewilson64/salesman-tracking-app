import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useGetAllVisits } from "../hooks/visit/useGetAllVisits";
import { GroupedVisit, Visit } from "../types/visit";

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

  const groupedVisits: GroupedVisit[] = Object.values(
      (visits as Visit[]).reduce<Record<string, GroupedVisit>>(
        (acc, visit) => {
          const key = visit.salesmanId
  
          if (!acc[key]) {
            acc[key] = {
              salesmanId: key,
              salesmanName: visit.salesmanName,
              salesmanImage: visit.salesmanImage,
              visits: [],
            };
          }
  
          acc[key].visits.push(visit);
  
          return acc;
        },
        {}
      )
    );

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
        data={groupedVisits}
        keyExtractor={(item) => item.salesmanName}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View className="mb-6">
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

            {/* VISIT LIST */}
            {item.visits.map((visit, index) => (
              <Pressable
                key={visit.id}
                onPress={() => router.push(`/sales-visits/${visit.id}`)}
                className="flex-row items-start p-3 border-b border-gray-300"
              >
                {/* NUMBER */}
                <Text className="w-6 font-bold">
                  {index + 1}.
                </Text>

                {/* VISIT INFO */}
                <View className="flex-1">
                  <Text className="font-semibold capitalize mb-1">
                    {visit.shopName}
                  </Text>

                  <Text className="text-sm">
                    In: {formatTime(visit.checkInAt ?? "")}
                  </Text>

                  {visit.checkOutAt && (
                    <Text className="text-sm">
                      Out: {formatTime(visit.checkOutAt)}
                    </Text>
                  )}

                  {visit.notes && (
                    <Text className="text-sm mt-2" numberOfLines={2}>
                      Notes: {visit.notes}
                    </Text>
                  )}
                </View>

                {/* RESULT BADGE */}
                <View
                  className={`mt-1 self-start px-2 py-1 rounded ${getResultStyle(
                    visit.visitResult
                  )}`}
                >
                  <Text className="text-xs font-semibold capitalize">
                    {visit.visitResult || "Checking in..."}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default OwnerVisitScreen;