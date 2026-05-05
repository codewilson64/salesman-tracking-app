import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "../stores/authStore";
import { Link, useRouter } from "expo-router";
import { loginSchema, TloginSchema } from "../libs/auth.schema";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<TloginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: TloginSchema) => {
    try {
      await login(data);
      router.replace("/home");
    } catch (error: any) {
      console.error(error.response?.data);
      const message = error.response?.data?.error || "An error occurred";

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
            Log in
          </Text>

          {/* EMAIL */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Email"
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

          {/* PASSWORD */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <View className="relative mb-4">
                <TextInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  className="border border-gray-300 rounded-lg p-4 pr-12"
                />

                <Pressable
                  onPress={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-4"
                  hitSlop={10}
                >
                  <Ionicons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="gray"
                  />
                </Pressable>
              </View>
            )}
          />
          {errors.password && (
            <Text className="text-red-500 mb-4">
              {errors.password.message}
            </Text>
          )}

          {/* LOGIN BUTTON */}
          <Pressable
            onPress={handleSubmit(onSubmit)}
            className="bg-black rounded-lg p-4"
          >
            <Text className="text-white text-center font-semibold">
              {isSubmitting ? "Logging in..." : "Log in"}
            </Text>
          </Pressable>

          {/* SIGN UP */}
          <Text className="text-black text-center mt-4">
            Don't have an account?{" "}
            <Link href="/signup">
              <Text className="underline text-blue-500 font-semibold">
                Sign up
              </Text>
            </Link>
          </Text>
        
          {/* Forgot password */}
          <Text className="text-center mt-3">
            <Link href="/forgot-password">
              <Text className="text-blue-500 underline">Forgot Password?</Text>
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