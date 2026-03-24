import { View, Text, ActivityIndicator, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetAreaById } from "../hooks/area/useGetAreaById";
import { useDeleteArea } from "../hooks/area/useDeleteArea";

const AreaDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter()
  const { data: area, isLoading, isError } = useGetAreaById(id);
  const { mutateAsync: deleteArea, isPending } = useDeleteArea();

  const handleDelete = () => {
    Alert.alert(
      `Delete ${area?.areaName}?`,
      "Are you sure you want to delete this area? This action cannot be undone.",
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
              await deleteArea(id);
              router.back();
            } catch (err: any) {
              const message = err?.response?.data?.message || "Failed to delete area";
              Alert.alert("Delete Failed", message);
            }
          }
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

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500">Error loading area</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/* Info */}
      <View className="mt-4">
        {/* Name */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Salesman</Text>
            <Text className="text-lg font-medium">{area.salesmanName}</Text>
            </View>
        </View>

        {/* Area Name */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Area</Text>
            <Text className="text-lg font-medium">{area.areaName}</Text>
            </View>
        </View>

        {/* Price */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">City</Text>
            <Text className="text-lg font-medium">{area.city}</Text>
            </View>
        </View>

        {/* Desc */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Day</Text>
            <Text className="text-lg font-medium">{area.day}</Text>
            </View>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Weeks</Text>
            <Text className="text-lg font-medium">
              {area.weeks?.length
                ? area.weeks.map((w: number) => `Week ${w}`).join(", ")
                : "-"}
            </Text>
            </View>
        </View>
        </View>
        
        {/* Button */}
        <View className="flex-1 justify-end mt-6">
          <Pressable
            onPress={handleDelete}
            disabled={isPending}
            className="bg-red-600 rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              Delete Area
            </Text>
          </Pressable>
        </View>
    </SafeAreaView>
  );
};

export default AreaDetail;