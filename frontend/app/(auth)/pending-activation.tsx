import { View, Text, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useLocalSearchParams } from "expo-router";

export default function PendingActivationScreen() {
  const { message } = useLocalSearchParams<{ message?: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white px-6 justify-center">
      <View className="items-center">
        <Text className="text-2xl font-bold text-center mb-4">
           Account Created
        </Text>

        <Text className="text-gray-600 text-center mb-8">
          {message || "Your company account has been created and is pending activation. Please contact support or your company administrator to complete setup."}
        </Text>

        <Link href="/login" asChild>
          <Pressable className="bg-black rounded-lg px-6 py-4 w-full">
            <Text className="text-white text-center font-semibold">
              Back to Login
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}