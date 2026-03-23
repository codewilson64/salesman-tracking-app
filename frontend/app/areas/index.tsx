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
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useGetAllArea } from "../hooks/area/useGetAllAreas";

/* ================= TYPES ================= */

type Area = {
  id: string;
  areaName: string;
  day: string;
  salesmanName: string;
};

type GroupedArea = {
  salesmanName: string;
  areas: Area[];
};

/* ================= SCREEN ================= */

const AreaScreen = () => {
  const router = useRouter();
  const { data: areas = [], isLoading, isError } = useGetAllArea();

  /* ================= GROUPING ================= */

  const groupedAreas: GroupedArea[] = Object.values(
    (areas as Area[]).reduce<Record<string, GroupedArea>>((acc, area) => {
      const key = area.salesmanName;

      if (!acc[key]) {
        acc[key] = {
          salesmanName: key,
          areas: [],
        };
      }

      acc[key].areas.push(area);

      return acc;
    }, {})
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
          Error occurred while fetching areas.
        </Text>
      </View>
    );
  }

  /* ================= RENDER ================= */

  return (
    <SafeAreaView className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">List of Areas</Text>

      <FlatList
        data={groupedAreas}
        keyExtractor={(item) => item.salesmanName}
        renderItem={({ item }) => (
          <View className="mb-6">
            {/* SALES MAN HEADER */}
            <View className="flex-row items-center mb-2">
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    item.salesmanName
                  )}&background=random&size=64`,
                }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <Text className="text-xl font-bold capitalize">
                {item.salesmanName}
              </Text>
            </View>

            {/* AREAS LIST */}
            {item.areas.map((area, index) => (
              <Pressable
                key={area.id}
                onPress={() => router.push(`areas/${area.id}`)}
                className="flex-row items-center p-3 border-b border-gray-300"
              >
                {/* NUMBER */}
                <Text className="w-6 font-bold">
                  {index + 1}.
                </Text>

                {/* AREA INFO */}
                <View className="flex-1">
                  <Text className="font-semibold capitalize">
                    {area.areaName} | {area.day}
                  </Text>
                </View>

                {/* EDIT BUTTON */}
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    router.push(`areas/edit/${area.id}`);
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
        onPress={() => router.push("/areas/create")}
        className="bg-black rounded-lg p-4 mb-4"
      >
        <Text className="text-white text-center font-semibold">
          + Add Area
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default AreaScreen;