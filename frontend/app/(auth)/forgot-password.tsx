import {
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { forgotPasswordSchema, TForgotPassword } from "../libs/forgotPassword";
import axios from "axios";

export default function ForgotPasswordScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: TForgotPassword) => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/auth/forgot-password`, data);

      // success feedback
      alert("Check your email for reset link");

      // optional: go back to login
      router.replace("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Something went wrong";

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
          {/* TITLE */}
          <Text className="text-3xl font-bold mb-6 text-center">
            Forgot Password
          </Text>

          <Text className="text-gray-500 text-center mb-6">
            Enter your email and we’ll send you a reset link
          </Text>

          {/* EMAIL */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
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

          {/* BUTTON */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-black rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Text>
          </Pressable>

          {/* BACK TO LOGIN */}
          <Text className="text-center mt-4">
            <Link href="/login">
              <Text className="text-blue-500 underline">
                Back to Login
              </Text>
            </Link>
          </Text>

          {/* SERVER ERROR */}
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