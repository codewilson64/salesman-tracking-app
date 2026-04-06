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
import { useGetAllArea } from "../../hooks/area/useGetAllAreas";
import { Area, GroupedArea } from "../../types/area";


const AreaScreen = () => {
  const router = useRouter();
  const { data: areas = [], isLoading, isError } = useGetAllArea();

  const groupedAreas: GroupedArea[] = Object.values(
    (areas as Area[]).reduce<Record<string, GroupedArea>>((acc, area) => {
      const key = area.salesmanId;

      if (!acc[key]) {
        acc[key] = {
          salesmanId: key,
          salesmanName: area.salesmanName,
          salesmanImage: area.salesmanImage,
          areas: [],
        };
      }

      acc[key].areas.push(area);

      return acc;
    }, {})
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
          Error occurred while fetching areas.
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

        <Text className="text-2xl font-bold">List of areas</Text>
      </View>

      <FlatList
        data={groupedAreas}
        keyExtractor={(item) => item.salesmanName}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className="p-2 mb-6">
            {/* SALES MAN HEADER */}
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

            {/* AREAS LIST */}
            {item.areas.map((area, index) => (
              <Pressable
                key={area.id}
                onPress={() => router.push(`screens/areas/${area.id}`)}
                className="flex-row items-center py-4 border-b border-gray-300"
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
                    router.push(`screens/areas/edit/${area.id}`);
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
        onPress={() => router.push("screens/areas/create")}
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