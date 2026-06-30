import { View, Text, ActivityIndicator, Pressable, Alert, Image } from "react-native";
import { useLocalSearchParams, useRouter} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetAreaById } from "../../hooks/area/useGetAreaById";
import { useDeleteArea } from "../../hooks/area/useDeleteArea";
import { useState } from "react";

import back from '../../assets/globalIcons/back.png'
import dots from "../../assets/globalIcons/dots.png";

const AreaDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(false);

  const { data: area, isLoading, isError } = useGetAreaById(id);
  const { mutateAsync: deleteArea, isPending } = useDeleteArea();

  const handleDelete = () => {
    setShowMenu(false);

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

  const handleEdit = () => {
    setShowMenu(false);

    router.push({
      pathname: "/screens/areas/edit/[id]",
      params: { id },
    });
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
      <View className="flex-row items-center mb-4 relative">
        <Pressable onPress={() => router.back()} className="mr-3 p-2">
          <Image source={back} className="w-6 h-6" resizeMode="contain" />
        </Pressable>

        <Text className="text-2xl font-bold flex-1">
          Detail Area
        </Text>

        {/* Dots */}
        <View className="relative">
          <Pressable onPress={() => setShowMenu(!showMenu)} className="p-2">
            <Image source={dots} className="w-6 h-6" resizeMode="contain" />
          </Pressable>

          {showMenu && (
            <View className="absolute top-10 right-0 bg-white rounded-xl border border-gray-200 shadow w-36 overflow-hidden z-20">

              <Pressable
                onPress={handleEdit}
                className="px-4 py-3 border-b border-gray-100"
              >
                <Text>Edit</Text>
              </Pressable>

              <Pressable onPress={handleDelete} disabled={isPending} className="px-4 py-3">
                <Text className="text-red-600">
                  {isPending ? "Deleting..." : "Delete"}
                </Text>
              </Pressable>

            </View>
          )}
        </View>
      </View>
      
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
            <Text className="text-gray-500 text-sm">Kota</Text>
            <Text className="text-lg font-medium">{area.city}</Text>
          </View>
        </View>

        {/* Desc */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Hari</Text>
            <Text className="text-lg font-medium">{area.day}</Text>
          </View>
        </View>
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <View>
            <Text className="text-gray-500 text-sm">Minggu</Text>
            <Text className="text-lg font-medium">
              {area.weeks?.length
                ? area.weeks.map((w: number) => `Week ${w}`).join(", ")
                : "-"}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AreaDetail;