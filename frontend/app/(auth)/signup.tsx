import { View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../stores/authStore";
import { Link, useRouter } from "expo-router";
import { signUpSchema, TsignUpSchema } from "../libs/auth.schema";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignupScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TsignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      companyName: "",
    },
  });

  const router = useRouter()

  const signup = useAuthStore((state) => state.signup);

  const onSubmit = async (data: TsignUpSchema) => {
    try {
      await signup(data)
      router.replace('/home')
    } 
    catch (error: any) {
      console.error(error.response.data);
      const message = error?.response?.data?.error || "An error occurred";

      setError("root", { type: "server", message });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold mb-8 text-center">
            Sign Up
          </Text>

          {/* EMAIL */}
          <View className="mb-4">
            <Text className="mb-2 font-normal text-gray-700">
              Email
            </Text>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              />
            )}
          />
          {errors.email && (
            <Text className="text-red-500 mb-3">
              {errors.email.message}
            </Text>
          )}
          </View>

          {/* PASSWORD */}
          <View className="mb-4">
            <Text className="mb-2 font-normal text-gray-700">
              Password
            </Text>

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                secureTextEntry
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 mb-4">
              {errors.password.message}
            </Text>
          )}
          </View>

          {/* COMPANY */}
          <View className="mb-4">
            <Text className="mb-2 font-normal text-gray-700">
              Company Name
            </Text>

          <Controller
            control={control}
            name="companyName"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                className="border border-gray-300 rounded-lg p-4 mb-4"
              />
            )}
          />
          {errors.companyName && (
            <Text className="text-red-500 mb-4">
              {errors.companyName.message}
            </Text>
          )}
          </View>

          {/* BUTTON */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-black rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              {isSubmitting ? "Signing up..." : "Create Account"}
            </Text>
          </Pressable>

          {/* LOGIN LINK */}
          <Text className="text-center mt-4">
            Already have an account?{" "}
            <Link href="/login">
              <Text className="underline text-blue-500 font-semibold">
                Login
              </Text>
            </Link>
          </Text>

          {/* ERROR */}
          {errors.root && (
            <Text className="text-red-500 text-center mt-4">
              {errors.root.message}
            </Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}