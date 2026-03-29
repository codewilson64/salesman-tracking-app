import { View, Text, ActivityIndicator, Image, Pressable, Alert } from "react-native";
import { useLocalSearchParams, useRouter} from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetSalesmanById } from "../hooks/salesman/useGetSalesmanById";
import { useDeleteSalesman } from "../hooks/salesman/useDeleteSalesman";

const SalesmanDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter()
  const { data: salesman, isLoading, isError } = useGetSalesmanById(id);
  const { mutateAsync: deleteSalesman, isPending } = useDeleteSalesman();

  const handleDelete = () => {
    Alert.alert(
      `Delete ${salesman?.name}?`,
      "Are you sure you want to delete this salesman? This action cannot be undone.",
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
              await deleteSalesman(id);
              router.back();
            } catch (err) {
              console.error(err);
            }
          },
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
        <Text className="text-red-500">Error loading salesman</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/* Avatar */}
      <View className="items-center mb-6">
        <Image
          source={{
            uri: salesman.profileImage
              ? salesman.profileImage
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  salesman.name
                )}&size=128`,
          }}
          className="w-32 h-32 rounded-full mb-4"
        />
        <Text className="text-2xl font-bold">{salesman.name}</Text>
        <Text className="text-gray-500">{salesman.role}</Text>
      </View>

      {/* Info */}
      <View className="mt-4">
        {/* Phone */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Phone</Text>
            <Text className="text-lg font-medium">{salesman.phone}</Text>
            </View>
        </View>

        {/* Email */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Email</Text>
            <Text className="text-lg font-medium">{salesman.email}</Text>
            </View>
        </View>

        {/* Address */}
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
            <Text className="text-gray-500 text-sm">Address</Text>
            <Text className="text-lg font-medium">{salesman.address}</Text>
            </View>
        </View>
        </View>

        <View className="flex-1 justify-end mt-6">
          <Pressable
            onPress={handleDelete}
            disabled={isPending}
            className="bg-red-600 rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              Delete Salesman
            </Text>
          </Pressable>
        </View>
    </SafeAreaView>
  );
};

export default SalesmanDetail;