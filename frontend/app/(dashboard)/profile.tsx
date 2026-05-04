import { View, Text, Image, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../stores/authStore";
import { useGetMe } from "../hooks/profile/useGetMe";

const Profile = () => {
  const router = useRouter();

  const { logout } = useAuthStore();
  const { data: user } = useGetMe();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 pl-4 pr-4 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
      {/* Header + Avatar */}
      <View className="mb-6">
        <View className="items-center">
          <Image
            source={{
              uri: user.profileImage
                ? user.profileImage
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.email
                  )}&size=128`,
            }}
            className="w-32 h-32 rounded-full mb-4"
          />

            <Text className="text-2xl font-bold">{user.email}</Text>
            <Text className="text-gray-500 mb-5">{user.role}</Text>

            <Pressable
              onPress={() => router.push("screens/profile/edit")}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Text className="text-sm font-medium text-gray-700">
                Edit Profile
              </Text>
            </Pressable>
        </View>
      </View>

      {/* Info Section */}
        <View className="mt-4">
          {/* Company */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
              <Text className="text-gray-500 text-sm">Company</Text>
              <Text className="text-lg font-medium">{user.companyName || "-"}</Text>
            </View>
          </View>
          {/* Name */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
              <Text className="text-gray-500 text-sm">Name</Text>
              <Text className="text-lg font-medium">{user.name || "-"}</Text>
            </View>
          </View>
          {/* Address */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
              <Text className="text-gray-500 text-sm">Address</Text>
              <Text className="text-lg font-medium">{user.address || "-"}</Text>
            </View>
          </View>
          {/* Phone */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
              <Text className="text-gray-500 text-sm">Phone</Text>
              <Text className="text-lg font-medium">{user.phone || "-"}</Text>
            </View>
          </View>
          {/* Email */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
              <Text className="text-gray-500 text-sm">Email</Text>
              <Text className="text-lg font-medium">{user.email || "-"}</Text>
            </View>
          </View>
          {/* Role */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <View>
              <Text className="text-gray-500 text-sm">Role</Text>
              <Text className="text-lg font-medium capitalize">{user.role || "-"}</Text>
            </View>
          </View>

        {/* Actions */}
          <View className="mt-4">
            <Pressable
              onPress={handleLogout}
              className="bg-red-600 rounded-lg p-4"
            >
              <Text className="text-white text-center font-semibold">
                Logout
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;